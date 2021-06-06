const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// 1) schema definition
const userSchema = mongoose.Schema({
  FirstName: {
    required: [true, "please enter username"],
    type: String,
    trim: true,
    maxlength: [30, "name shouldn't be more than 30 characters"],
  },
  LastName: {
    required: [true, "please enter username"],
    type: String,
    trim: true,
    maxlength: [30, "name shouldn't be more than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: [true, "email already used"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    required: [true, "enter your password"],
    type: String,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    required: [true, "please confirm your password"],
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "wrong password",
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// 2) middlewares

// userSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.pre("save", async function (next) {
  //only run this function if password was modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //deelte password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // false means not chagned
    return JWTTimeStamp < changedTimeStamp;
    // console.log(changedTimeStamp, JWTTimeStamp);
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires =
    Date.now() + process.env.RESET_TOKEN_TIMER * 60 * 1000;
  return resetToken;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
