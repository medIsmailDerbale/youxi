const Cart = require("../models/cart");
const Order = require("../models/orderModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");

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
    cart.items.forEach(async (el) => {
      const product = await Product.findById(el.productId);
      product.quantity -= el.qty;
      product.save();
    });
    cart.remove();
    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      status: "failed",
      data: null,
    });
  }
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.status(200).json({
      status: "success",
      order,
    });
  } else {
    res.status(404).json({
      status: "failed",
      data: null,
    });
  }
});

exports.getOrderStatsToday = catchAsync(async (req, res) => {
  // to get yyyy-mm-dd
  const date = new Date().toISOString().split("T")[0];
  const stats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(date) },
      },
    },
    {
      $group: {
        _id: "$status",
        number: { $sum: 1 },
        revenue: { $sum: "$cart.totalCost" },
        productQuantity: { $sum: "$cart.totalQty" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    stats,
  });
});

exports.getOrderStatsAll = catchAsync(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        number: { $sum: 1 },
        revenue: { $sum: "$cart.totalCost" },
        productQuantity: { $sum: "$cart.totalQty" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  return res.status(200).json({
    status: "success",
    stats,
  });
});

exports.sevenLastDays = catchAsync(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: { createdAt: "$createdAt", status: "$status" },
        number: { $sum: 1 },
        revenue: { $sum: "$cart.totalCost" },
        productQuantity: { $sum: "$cart.totalQty" },
      },
    },
    {
      $sort: {
        "_id.createdAt": 1,
        "_id.status": 1,
      },
    },
  ]);
  return res.status(200).json({
    status: "success",
    stats,
  });
});

exports.modifyOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status;
    order.save();
    res.status(200).json({
      status: "success",
      order,
    });
  } else {
    res.status(404).json({
      status: "failed",
      data: null,
    });
  }
});

exports.getUserOrders = catchAsync(async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const orders = await Order.find({ user: decoded._id }).sort("-createdAt");
  res.status(200).json({
    status: "success",
    len: orders.length,
    orders,
  });
});
