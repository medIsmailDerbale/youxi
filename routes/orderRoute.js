const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/checkout")
  .post(authController.protect, orderController.checkout);
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.getOrderById
  );

module.exports = router;
