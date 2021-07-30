const Product = require("../models/productModel");
const Cart = require("../models/cart");

exports.getProduct = async (req, res) => {
  const productId = req.params.id;


  try {
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    console.log(req.user);
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
    cart = new Cart({});


    // add the product to the cart
    const product = await Product.findById(productId);

    const itemIndex = cart.items.findIndex((p) => p.productId == productId);

    //if (itemIndex > -1) {
    // if product exists in the cart, update the quantity
    //  cart.items[itemIndex].qty++;
    //  cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
    //  cart.totalQty++;
    //  cart.totalCost += product.price;
    //} else {
    // if product does not exists in cart, find it in the db to retrieve its price and add new item
    cart.items.push({
      productId: productId,
      qty: 1,
      price: product.price,
      title: product.name,
    });
    cart.totalQty++;
    cart.totalCost += product.price;

    // if the user is logged in, store the user's id and save cart to the db
    /*if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }*/
    await cart.save();

/*    req.session.cart = cart;
    req.flash("success", "Item added to the shopping cart");
    res.redirect(req.headers.referer);*/
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
};


exports.getPanier =  (req, res) => {}