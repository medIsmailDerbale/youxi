const express = require("express");
const panierController = require("../controllers/panierController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/add-to-cart/:id")
  .get(authController.protect, panierController.getProduct);
router.get("/panier", authController.protect, panierController.getPanier);

module.exports = router;
