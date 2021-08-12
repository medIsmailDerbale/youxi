const express = require("express");
const panierController = require("../controllers/panierController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/add-to-cart/:id")
  .get(authController.protect, panierController.getProduct);

router
  .route("/add-quantity")
  .post(authController.protect, panierController.addOneToQuantity);

router
  .route("/mince-quantity")
  .post(authController.protect, panierController.TakeOneFromQuantity);

router
  .route("/remove-item")
  .post(authController.protect, panierController.removeItemFromCart);

router.get("/panier", authController.protect, panierController.getPanier);

module.exports = router;
