const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

const signToken = (id1) =>
  jwt.sign({ _id: id1 }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    path: "/",
  };
  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

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
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  // 3) if everything ok send JWT
  createSendToken(user, 200, res);
});

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
    return next(
      new AppError("You are not logged in Please login to get access", 401)
    );
  }
  // 2) verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check if user still exists
  const freshUser = await User.findById(decoded._id);
  if (!freshUser) {
    return next(new AppError("The user does no longer exists", 401));
  }
  // 4) check if user changed password after the token was issued
  // if (freshUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("User recently changed password Please login again", 401)
  //   );
  // }
  //grant access to protected routes
  req.user = freshUser;
  next();
});

// only for rendered pages with no errors
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) getting token and check if it's there

  if (req.cookies.jwt) {
    // 2) verification of the token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // 3) check if user still exists
    const freshUser = await User.findById(decoded._id);
    if (!freshUser) {
      return next();
    }
    // 4) check if user changed password after the token was issued
    // if (freshUser.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     new AppError("User recently changed password Please login again", 401)
    //   );
    // }
    //grant access to protected routes

    // there is a logged in user
    res.locals.user = freshUser;
    return next();
  }
  next();
});

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
  createSendToken(newUser, 201, res);
});
