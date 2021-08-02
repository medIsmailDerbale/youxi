const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // execute query
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const products = await features.query;
  // send response
  res.status(200).json({
    status: "success",
    length: products.length,
    data: {
      products,
    },
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("invalid product Id"));
  }

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("there is no product with that id", 404));
  }
  let category = await Category.findOne({
    products: { $elemMatch: { $eq: req.params.id } },
  });

  await category.products.forEach((el, i) => {
    if (el._id == req.params.id) {
      index = i;
    }
  });

  category.products.splice(index, 1);
  category = await category.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!product) {
    return next(AppError("invalid product Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: { product },
  });
});
