const User = require('./../models/userModel');
const Product = require("../models/productModel");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get products data from collection
  //const products = await Product.find();

  // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render('overview');
});