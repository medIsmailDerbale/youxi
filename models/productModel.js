const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product must have a name"],
      unique: true,
      trim: true,
      maxlength: [50, "product name should be less or equal to 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "product must have a price"],
    },
    // colors: [String],
    // dimensions: {
    //   type: String,
    // },
    description: {
      type: String,
      required: [true, "product must have a description"],
      trim: true,
    },
    addedAt: {
      type: Date,
      default: Date.now(),
    },
    imageCover: {
      type: String,
      required: [true, "A product must have a cover image"],
      default: "/img/product_default.png",
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "can't order more of this product"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
