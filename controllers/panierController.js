const Product = require("../models/productModel");
const User = require("../models/userModel");
const Cart = require("../models/cart");
const Category = require("../models/categoryModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;

  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;

    if (req.cookies.jwt) {
      user_cart = await Cart.findOne({ user: decoded._id });
    }
    let cart;

    if (req.cookies.jwt && !user_cart) {
      cart = new Cart({});
    } else if (req.cookies.jwt && user_cart) {
      cart = user_cart;
    } else {
    }
    // add the product to the cart
    const product = await Product.findById(productId);

    const itemIndex = cart.items.findIndex((p) => p.productId == productId);

    if (itemIndex > -1) {
      // if product exists in the cart, update the quantity
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty++;
      cart.totalCost += product.price;
    } else {
      // if product does not exists in cart, find it in the db to retrieve its price and add new item
      cart.items.push({
        productId: productId,
        qty: 1,
        price: product.price,
        title: product.name,
      });
      cart.totalQty++;
      cart.totalCost += product.price;
    }
    //if the user is logged in, store the user's id and save cart to the db
    if (req.cookies.jwt) {
      cart.user = decoded._id;
      await cart.save();
    }

    /*    req.session.cart = cart;
    req.flash("success", "Item added to the shopping cart");
    res.redirect(req.headers.referer);*/
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

exports.getPanier = catchAsync(async (req, res) => {
  const categories = await Category.find({ subCategory: false })
    .sort("name")
    .select("-products -addedAt");
  let tab = [];

  categories.forEach(myFunction);
  function myFunction(item) {
    if (item.subCategory === false) {
      item.categories.forEach(secFunction);
      function secFunction(item) {
        tab.push(item);
      }
    }
  }
  //geting the user & panier qnty
  let userName;
  let cartQty;
  let url;
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded._id);
    userName = "Welcome," + user.FirstName;
    url = "#";
  } else {
    userName = "login/signup";
    cartQty = 0;
    url = "/signup";
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  // find the cart, whether in session or in db based on the user state
  let cart_user;
  if (req.cookies.jwt) {
    cart_user = await Cart.findOne({ user: decoded._id });
    if (req.cookies.jwt && cart_user) {
      cartQty = cart_user.totalQty;
    } else if (req.cookies.jwt && !cart_user) {
      cartQty = 0;
    }
  }
  // if user is signed in and has cart, load user's cart from the db
  if (req.cookies.jwt && cart_user) {
    return res.status(200).render("panier2", {
      userName,
      url,
      cartQty,
      categories: tab,
      cart: cart_user,
      pageName: "Shopping Cart",
      products: await productsFromCart(cart_user),
    });
  } else if (req.cookies.jwt && !cart_user) {
    cart_user = new Cart({});
    cart_user.totalQty = 0;
    cart_user.totalCost = 0;
    cart_user.items = [];
    cart_user.user = decoded._id;
    await cart_user.save();
    //console.log(carz)
    return res.status(200).render("panier2", {
      userName,
      url,
      cartQty,
      categories: tab,
      cart: cart_user,
      pageName: "Shopping Cart",
      products: await productsFromCart(cart_user),
    });
  }
});

async function productsFromCart(cart) {
  let products = [];
  let qty = []; // array of objects

  console.log(cart.items);
  cart.items.forEach(async (item) => {
    let foundProduct = await Product.findById(item.productId);
    let copy = JSON.parse(JSON.stringify(foundProduct));
    copy.qty = item.qty;
    products.push(copy);
  });
  return products;
}

exports.addOneToQuantity = catchAsync(async (req, res) => {
  // post req
  // req.body.productId
  const productId = req.body.productId;
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;

    if (req.cookies.jwt) {
      user_cart = await Cart.findOne({ user: decoded._id });
    }
    let cart;

    if (req.cookies.jwt && !user_cart) {
      cart = new Cart({});
    } else if (req.cookies.jwt && user_cart) {
      cart = user_cart;
    } else {
    }

    // add the product to the cart
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        status: "failed",
        error: "no suck product with the provided id",
      });
    }
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);

    if (itemIndex > -1) {
      // if product exists in the cart, update the quantity
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty++;
      cart.totalCost += product.price;
    } else {
      // if product does not exists in cart, find it in the db to retrieve its price and add new item
      cart.items.push({
        productId: productId,
        qty: 1,
        price: product.price,
        title: product.name,
      });
      cart.totalQty++;
      cart.totalCost += product.price;
    }
    //if the user is logged in, store the user's id and save cart to the db
    if (req.cookies.jwt) {
      cart.user = decoded._id;
      await cart.save();
    }

    /*    req.session.cart = cart;
    req.flash("success", "Item added to the shopping cart");
    res.redirect(req.headers.referer);*/
    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "failed", error: err.message });
  }
});

exports.TakeOneFromQuantity = catchAsync(async (req, res) => {
  // post req
  // req.body.productId
  const productId = req.body.productId;
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;

    if (req.cookies.jwt) {
      user_cart = await Cart.findOne({ user: decoded._id });
    }
    let cart;

    if (req.cookies.jwt && !user_cart) {
      cart = new Cart({});
    } else if (req.cookies.jwt && user_cart) {
      cart = user_cart;
    } else {
    }

    // add the product to the cart
    const product = await Product.findById(productId);

    const itemIndex = cart.items.findIndex((p) => p.productId == productId);

    if (itemIndex > -1) {
      // if there is only one item to delete
      if (cart.items[itemIndex].qty == 1) {
        cart.totalQty--;
        cart.totalCost -= product.price;
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].qty--;
        cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
        cart.totalQty--;
        cart.totalCost -= product.price;
      }
    } else {
      return res.status(404).json({
        status: "failed",
        error: "no such item in the cart",
      });
    }
    //if the user is logged in, store the user's id and save cart to the db
    if (req.cookies.jwt) {
      cart.user = decoded._id;
      await cart.save();
    }

    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
});

exports.removeItemFromCart = catchAsync(async (req, res) => {
  // post req
  // req.body.productId
  const productId = req.body.productId;
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;

    if (req.cookies.jwt) {
      user_cart = await Cart.findOne({ user: decoded._id });
    }
    let cart;

    if (req.cookies.jwt && !user_cart) {
      cart = new Cart({});
    } else if (req.cookies.jwt && user_cart) {
      cart = user_cart;
    } else {
    }

    // add the product to the cart
    const product = await Product.findById(productId);

    const itemIndex = cart.items.findIndex((p) => p.productId == productId);

    if (itemIndex > -1) {
      cart.totalQty -= cart.items[itemIndex].qty;
      cart.totalCost -= cart.items[itemIndex].qty * product.price;
      cart.items.splice(itemIndex, 1);
    } else {
      return res.status(404).json({
        status: "failed",
        error: "no such item in the cart",
      });
    }
    //if the user is logged in, store the user's id and save cart to the db
    if (req.cookies.jwt) {
      cart.user = decoded._id;
      await cart.save();
    }

    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
});
