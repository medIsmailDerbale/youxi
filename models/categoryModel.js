const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name field is required"],
    trim: true,
    maxlength: [40, "max name length is 40"],
    unique: [true, "name must be unique"],
  },
  subCategory: {
    type: Boolean,
    required: [true, "u must specifie subcategory"],
  },
  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  ],
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
});

categorySchema.pre("save", function (next) {
  if (this.subCategory) {
    this.categories = undefined;
  } else this.products = undefined;

  next();
});

categorySchema.pre(/^find/, function (next) {
  this.populate({ path: "products", select: "-__v" });
  this.populate({ path: "categories", select: "-__v" });
  this.select("-__v");
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
