const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const panierControlelr = require("../controllers/panierController");
const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/login", viewsController.getLoginForm);
router.get("/signup", viewsController.getSignup);
router.get("/search", viewsController.search);
router.get("/me", authController.protect, viewsController.getAccount);

router.get(
  "/products",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getProducts
);

router.get(
  "/products/search",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.searchProducts
);

router.get(
  "/users",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getUsers
);

router.get("/signup", viewsController.getSignup);

router.get(
  "/categories",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getCategories
);

router.get("/categories/:id", viewsController.getCategorie);

router.get(
  "/orders",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getOrdersAdmin
);

router.get("/cart", panierControlelr.getPanier);

router.get("/forgot-password", viewsController.getForgotPassword);
router.get("/reset-password/:token", viewsController.getResetPassword);

router.get("/p/:id", viewsController.getProductDetail);
router.get(
  "/dashboard",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getStatsDashboard
);
//router.get('/product/:slug', viewsController.getProduct);
//need to implement  viewsController.getProduct in viewsController

module.exports = router;
