const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.setProductUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  let token = req.cookies.jwt;
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!req.body.user) req.body.user = decoded._id;
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
