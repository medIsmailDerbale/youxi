const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const { resolveSoa } = require("dns");

const signToken = (id1) =>
  jwt.sign({ _id: id1 }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    path: "/",
  };
  cookieOptions.secure =
    req.secure || req.headers["x-forwarded-proto"] === "https";

  res.cookie("jwt", token, cookieOptions);

  // remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exists ?
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) check if user exists
  const user = await User.findOne({
    $and: [{ email }, { active: true }],
  }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  // 3) if everything ok send JWT
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  // res.status(200).json({ status: 'success' });
  res.redirect("/");
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).redirect("/login");
  }
  // 2) verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check if user still exists
  const freshUser = await User.findById(decoded._id);
  if (!freshUser) {
    return next(new AppError("The user does no longer exists", 401));
  }
  // 4) check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password Please login again", 401)
    );
  }
  // 5) check if user is active
  if (!freshUser.active) {
    return next(
      new AppError("User is not active please contact the administrator", 401)
    );
  }
  //grant access to protected routes
  req.user = freshUser;
  next();
});

// only for rendered pages with no errors
exports.isLoggedIn = async (req, res, next) => {
  // 1) getting token and check if it's there

  if (req.cookies.jwt) {
    // 2) verification of the token
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      // 3) check if user still exists
      const freshUser = await User.findById(decoded._id);
      if (!freshUser) {
        return next();
      }
      //4) check if user changed password after the token was issued
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError("User recently changed password Please login again", 401)
        );
      }
      //grant access to protected routes
      if (!freshUser.active) {
        return next(
          new AppError(
            "User is not active please contact the administrator",
            401
          )
        );
      }
      // there is a logged in user
      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("you do not have permission to perform this action", 403)
      );
    next();
  };
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, req, res);
});

exports.forgotPassword = async (req, res, next) => {
  // 1) get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("there is no user with this email address", 404));
  // 2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) send it to the email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset Token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "there was an error sending the email. try again later!",
        500
      )
    );
  }
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) if token not expired and there is user,set new password
  if (!user) {
    return next(new AppError("token expired or invalid token", 400));
  }

  // 3) update changed passwordAt for user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) update changed passwordAt for user

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await await User.findById(req.user.id).select("+password");
  // 2) check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  // 3) update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  if (req.body.password === req.body.passwordConfirm) await user.save();
  // user.findByIdAndUpdate will NOT work as Intended!

  // 4) log user in, send JWT
  createSendToken(user, 200, req, res);
});
