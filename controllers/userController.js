const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.blockUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  // verify if user exists
  if (!user) return next(new AppError("user doesn't exists", 404));
  user.active = false;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.activateUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  // verify if user exists
  if (!user) return next(new AppError("user doesn't exists", 404));
  user.active = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
