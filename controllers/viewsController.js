const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get products data from collection
  //const products = await Product.find();

  // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render("overview");
});

exports.getAccount = catchAsync((req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render("signup", {
    title: "Create a new account",
  });
};

exports.getProducts = catchAsync(async (req, res, next) => {
  //1) get product data from collection
  const products = await Product.find();

  //2) build template

  //3) Render that template using product data from 1
  res.status(200).render("product", {
    title: "Products",
    products,
  });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  //1) get product data from collection
  const categories = await Category.find();

  //2) build template

  //3) Render that template using product data from 1
  res.status(200).render("category", {
    title: "Categories",
    categories,
  });
});
