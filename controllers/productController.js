const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const sharp = require("sharp");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, );
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new AppError("not an image please an image file", 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImage = upload.single("photo");

exports.resizeImage = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.body.name}.jpeg`;
  sharp(req.file.buffer)
    .resize(380, 380)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);

  next();
};

exports.createProduct = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  const categoryId = req.body.category;
  const cat = await Category.findById(categoryId);

  delete req.body.category;
  if (req.file) req.body.imageCover = `/img/${req.file.filename}`;
  const newProduct = await Product.create(req.body);
  cat.products.push(newProduct);
  await cat.save();
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

  let index;
  category.products.forEach((el, i) => {
    if (el._id == req.params.id) {
      index = i;
    }
  });

  category.products.splice(index, 1);
  await category.save();

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

exports.searchProduct = catchAsync(async (req, res, next) => {
  const message = ".*" + req.query.s + ".*";
  let products = await Product.find({
    name: { $regex: message, $options: "i" },
  });
  let categorie = await Category.find({
    name: { $regex: message, $options: "i" },
  });

  function getProductsFromCategorie(item) {
    item.products.forEach(pushFunct);
  }
  function pushFunct(item) {
    let found = false;
    for (let i = 0, len = products.length; i < len; i++) {
      if (item._id == products[i]._id) {
        found = true;
        return;
      }
    }
    if (!found) products.push(item);
  }
  for (let i = 0; i < categorie.length; i++) {
    if (categorie[i].subCategory === false) {
      categorie[i].categories.forEach(getProductsFromCategorie);
    } else if (categorie.length > 0) {
      categorie[i].products.forEach(pushFunct);
    }
  }
  res.status(200).json({
    status: "success",
    len: products.length,
    products,
  });
});
