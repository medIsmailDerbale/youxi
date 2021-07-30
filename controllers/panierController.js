const Product = require("../models/productModel");
const Cart = require("../models/cart");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.getProduct = async (req, res) => {
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

    /*if (
      (req.user && !user_cart && req.session.cart) ||
      (!req.user && req.session.cart)
    ) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }*/
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
};

exports.getPanier = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // find the cart, whether in session or in db based on the user state
    let cart_user;
    if (req.cookies.jwt) {
      cart_user = await Cart.findOne({ user: decoded._id });
    }
    // if user is signed in and has cart, load user's cart from the db
    if (req.cookies.jwt && cart_user) {
      return res.render("panier", {
        cart: cart_user,
        pageName: "Shopping Cart",
        products: await productsFromCart(cart_user),
      });
    }
    // if there is no cart in session and user is not logged in, cart is empty
    /*if (!req.session.cart) {
      return res.render("shop/shopping-cart", {
        cart: null,
        pageName: "Shopping Cart",
        products: null,
      });
    }*/
    // otherwise, load the session's cart
    /* return res.render("shop/shopping-cart", {
      cart: req.session.cart,
      pageName: "Shopping Cart",
      products: await productsFromCart(req.session.cart),
    });*/
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
};

async function productsFromCart(cart) {
  let products = []; // array of objects
  for (const item of cart.items) {
    let foundProduct = (
      await Product.findById(item.productId).populate("category")
    ).toObject();
    //foundProduct["qty"] = item.qty;
    foundProduct["totalPrice"] = item.price;
    products.push(foundProduct);
  }
  return products;
}
