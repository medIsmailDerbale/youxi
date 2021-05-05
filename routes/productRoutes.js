const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(authController.protect, productController.getProductById)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.delete
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateProduct
  );

module.exports = router;
