const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// 1) schema definition
const userSchema = mongoose.Schema({
  name: {
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
    select: false,
  },
});

// 2) middlewares

userSchema.pre("save", async function (next) {
  //only run this function if password was modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //deelte password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
