const Category = require("../models/categoryModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");

// const addProduct = catchAsync(async (req, res, next) => {
//   let category = await Category.findById(req.params.id);
//   // verify if category exists and if there is product id sent
//   if (!category || !req.body.productId)
//     return next(new AppError("category not found or productId missing"));
//   // verify if this is a subcategory
//   if (!category.subCategory)
//     return next(
//       new AppError(
//         "you cant add a product to a category please try again with a sub category",
//         400
//       )
//     );

//   // verify if the entered product id is valid
//   if (!(await Product.findById(req.body.productId)))
//     return next(new AppError("there is no product with this id", 404));
//   // check if the product is already in the sub categorie
//   let exists = false;
//   category.products.map((el) => {
//     if (el.id === req.body.productId) exists = true;
//   });

//   if (exists) {
//     return next(new AppError("product already exists in category", 400));
//   }

//   category.products.push(req.body.productId);
//   category = await category.save();
//   res.status(200).json({
//     status: "success",
//     data: { category },
//   });
// });

exports.createCategory = catchAsync(async (req, res, next) => {
  let parentCategoryId;
  if (req.body.subCategory) {
    parentCategoryId = req.body.parentCategory;
    delete req.body.parentCategory;
  }
  const newCategory = await Category.create(req.body);
  if (parentCategoryId && req.body.subCategory) {
    const parent = await Category.findById(parentCategoryId);
    parent.categories.push(newCategory);
    await parent.save();
  }

  res.status(201).json({
    status: "success",
    data: {
      category: newCategory,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("there is no category with that id", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!category) {
    return next(new AppError("there is no category with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const categories = await features.query;
  //send response
  res.status(200).json({
    status: "success",
    length: categories.length,
    data: { categories },
  });
});

exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("there is no category with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  // verify the existance of this category
  if (!category) return next(new AppError("category not found", 404));
  // if its a subcategory
  if (category.subCategory) {
    // verify if productId exists
    if (!req.params.id2) return next(new AppError("productId missing", 404));
    // parcouring the products table to find and delete the specified product
    let index = -1;
    await category.products.forEach((el, i) => {
      if (el._id == req.params.id2) {
        index = i;
      }
    });
    if (index < 0)
      return next(
        new AppError("there is no product with this id in the category", 404)
      );
    category.products.splice(index, 1);
    category = await category.save();
    res.status(200).json({
      status: "success",
      data: { category },
    });
    // if its a category
  } else {
    // verify if the categoryId exists
    if (!req.params.id2)
      return next(new AppError("category id not found", 404));
    let index = -1;

    await category.categories.forEach((el, i) => {
      if (el._id == req.params.id2) {
        index = i;
      }
    });
    console.log(index);
    if (index < 0)
      return next(
        new AppError("there is no category with this id in the category", 404)
      );
    await category.categories.splice(index, 1);
    category = await category.save();
    res.status(200).json({
      status: "success",
      data: { category },
    });
  }
});

exports.addItem = catchAsync(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  //verify if category exists
  if (!category) return next(new AppError("category not found", 404));

  // if its a subcategory add product
  if (category.subCategory) {
    //verify existance of productId
    if (!req.body.productId)
      return next(new AppError("productId missing", 404));
    //verify if product exists
    if (!(await Product.findById(req.body.productId)))
      return next(new AppError("there is no product with this id", 404));
    // check if the product is already in the sub categorie
    let exists = false;
    category.products.map((el) => {
      if (el.id === req.body.productId) exists = true;
    });
    if (exists) {
      return next(new AppError("product already exists in category", 400));
    }
    category.products.push(req.body.productId);
    category = await category.save();
    res.status(200).json({
      status: "success",
      data: { category },
    });
  }
  // categorie handling adding subcategories to a categorie
  else {
    //verify if categoryId is provided
    if (!req.body.categoryId)
      return next(new AppError("categoryId missing", 404));
    // verify if the subcategorie Id is valid
    if (!(await Category.findById(req.body.categoryId)))
      return next(
        new AppError("wrong  subCategory Id please enter a valid one", 400)
      );
    // verify for duplicates
    let exists = false;
    category.categories.map((el) => {
      if (el.id === req.body.categoryId) exists = true;
    });
    if (exists) return next(new AppError("sub category already exists", 400));
    // add category to categories and save it
    category.categories.push(req.body.categoryId);
    category = await category.save();
    //send response
    res.status(200).json({
      status: "success",
      data: { category },
    });
  }
});

exports.getCategoryByProduct = catchAsync(async (req, res, next) => {
  let category = await Category.findOne({
    products: { $elemMatch: { $eq: req.params.id } },
  });
  if (category)
    res.status(200).json({
      status: "success",
      data: { category },
    });
  else
    res.status(404).json({
      status: "failed",
    });
});
