const Cart = require("../models/cart");
const Order = require("../models/orderModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

exports.checkout = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt) {
    res.redirect("/login");
  }
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOne({ user: decoded._id });
    const order = await Order.create({
      cart: {
        totalCost: cart.totalCost,
        totalQty: cart.totalQty,
      },
      user: decoded._id,
      items: cart.items,
      address: req.body.address,
    });
    cart.remove();
    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
