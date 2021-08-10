const crypto = require("crypto");

const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Order = require("../models/orderModel");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const orderController = require("../controllers/orderController");
const http = require("http");
const { default: axios } = require("axios");

exports.getOverview = catchAsync(async (req, res, next) => {
  // execute query
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const numProducts = await Product.countDocuments();
  const pages = Math.ceil(numProducts / 16);
  current = req.query.page || 1;

  const products = await features.query;

  //create categories 
  const categories = await Category.find().sort("name").select("-products -addedAt");
  let tab = [];

  categories.forEach(myFunction);
  function myFunction(item) {
    if(item.subCategory === false){
      item.categories.forEach(secFunction);
      function secFunction(item){
        tab.push(item);
      }
    }
  }

  // send response
  res.status(200).render("overview", {
    title: "Overview",
    pages,
    current,
    products,
    tab,
    categories
  });
});


exports.search = catchAsync(async (req, res, next) => {

    //create categories 
  const categories = await Category.find().sort("name").select("-products -addedAt");
  let tab = [];

  categories.forEach(myFunction);
  function myFunction(item) {
    if(item.subCategory === false){
      item.categories.forEach(secFunction);
      function secFunction(item){
        tab.push(item);
      }
    }
  }

  const message = ".*" + req.query.s + ".*";

  //Build query
  //1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  //Advanced filtering
  //let queryStr = JSON.stringify(queryObj);
  //queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g,(match) => `$${match}`);
  let query = Product.find({ name: { $regex: message, $options: "i" } });

  //Sorting
  if (req.query.sort) {
    const sortedBy = req.query.sort.split(",").join("");
    query = query.sort(sortedBy);
  } else {
    query = query.sort("name");
  }

  //Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join("");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  //Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit || 16;
  const skip = (page - 1) * limit;

  const numProducts = await Product.countDocuments({
    name: { $regex: message, $options: "i" },
  });
  const pages = Math.ceil(numProducts / 16);
  const current = req.query.page || 1;
  query = query.skip(skip).limit(limit);

  //Execute query
  products = await query;

  // send response
  res.status(200).render("search", {
    title: "Result",
    pages,
    current,
    products,
    s: req.query.s,
    tab,
    categories
  });
});

exports.getAccount = async(req, res) => {
  const categories = await Category.find().sort("name").select("-products -addedAt");
  let tab = [];

  categories.forEach(myFunction);
  function myFunction(item) {
    if(item.subCategory === false){
      item.categories.forEach(secFunction);
      function secFunction(item){
        tab.push(item);
      }
    }
  }

  res.status(200).render("account", {
    title: "My account",
    tab,
    categories
  });
};

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

exports.getUsers = catchAsync(async (req, res, next) => {
  //1) get product data from collection
  const users = await User.find();

  //2) build template
  //3) Render that template using product data from 1
  res.status(200).render("users", {
    title: "Users",
    users,
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

exports.getCategorie = catchAsync(async (req, res, next) => {


  const categorie = await Category.findById(req.params.id);
  let products = [];
    //2) build template
  
  if (categorie.subCategory===false){
    categorie.categories.forEach(myFunction);

      function myFunction(item) {
        item.products.forEach(secFunction);
        function secFunction(item){
          products.push(item);
        }
      }
  }else{
    categorie.products.forEach(secFunction);
      function secFunction(item){
        products.push(item);
      }
  }
  //3) Render that template using product data from 1
  res.status(200).render("oneCategory", {
    title: "Categorie",
    categorie,
    products,
  });
});

exports.getForgotPassword = (req, res) => {
  res.status(200).render("forgotPassword", {
    title: "Forgot Password",
  });
};

exports.getResetPassword = catchAsync(async (req, res, next) => {
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
  res.status(200).render("resetPassword", {
    title: "Reset your password",
  });
});

exports.getProductDetail = catchAsync(async (req, res, next) => {
  //create categories 
  const categories = await Category.find().sort("name").select("-products -addedAt");
  let tab = [];

  categories.forEach(myFunction);
  function myFunction(item) {
    if(item.subCategory === false){
      item.categories.forEach(secFunction);
      function secFunction(item){
        tab.push(item);
      }
    }
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("invalid product Id"));
  }
  res.status(200).render("oneProduct", {
    product,
    categories,
    tab,
  });
});

exports.getOrdersAdmin = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("user");
  res.status(200).render("orders", {
    orders,
  });
});

exports.getStatsDashboard = catchAsync(async (req, resp, next) => {
  axios
    .all([
      /* 1st req */
      axios.get("http://localhost:8000/api/v1/order/order-stats-today", {
        headers: {
          Cookie: `jwt=${req.cookies.jwt}`,
        },
      }),
      /* 2nd req */
      axios.get("http://localhost:8000/api/v1/order/order-stats-all", {
        headers: {
          Cookie: `jwt=${req.cookies.jwt}`,
        },
      }),
    ])
    .then(
      axios.spread(function (res1, res2) {
        resp.status(200).render("statsDashboard", {
          statsDataToday: JSON.stringify(res1.data),
          statsDataAll: JSON.stringify(res2.data),
        });
      })
    )
    .catch((e) => {
      console.log(e);
    });
});
