const mongoose = require("mongoose");
const Product = require("../models/productModel");


const panierSchema = mongoose.Schema({
  
  products: [Product.id],
  Total:Number,

});

const Panier = mongoose.model("Panier", panierSchema);

module.exports = Panier;
