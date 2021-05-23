const express = require("express");
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.createCategory
  )
  .get(authController.protect, categoryController.getAllCategories);

router
  .route("/:id")
  .get(authController.protect, categoryController.getCategoryById)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.deleteCategory
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.updateCategory
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.addItem
  );

router
  .route("/:id/:id2")
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.deleteItem
  );

module.exports = router;
