const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/order-stats-today")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.getOrderStatsToday
  );

router
  .route("/order-stats-all")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.getOrderStatsAll
  );

router
  .route("/checkout")
  .post(authController.protect, orderController.checkout);
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.getOrderById
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.modifyOrder
  );

module.exports = router;
