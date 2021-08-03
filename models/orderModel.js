const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cart: {
    totalQty: {
      type: Number,
      default: 0,
      required: [true, "totalQty is a required field"],
    },
    totalCost: {
      type: Number,
      default: 0,
      required: [true, "totalCost is a required field"],
    },
  },
  address: {
    type: String,
    required: [true, "the address is a required field"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      qty: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
      title: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
