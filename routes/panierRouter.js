const express = require("express");
const panierController = require("../controllers/panierController");

const router = express.Router();

router
  .route("/")
  .post(panierController.postProduct);

module.exports = router;