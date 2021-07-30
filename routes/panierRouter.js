const express = require("express");
const panierController = require("../controllers/panierController");

const router = express.Router();

router.route("/add-to-cart/:id").get(panierController.getProduct);
router.get("/panier", panierController.getPanier);


module.exports = router;
