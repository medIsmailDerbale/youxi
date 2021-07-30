const express = require("express");
const panierController = require("../controllers/panierController");

const router = express.Router();

router
  .route("/")
  .get(panierController.getProduct);

module.exports = router;