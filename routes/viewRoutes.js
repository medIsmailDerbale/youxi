const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/login", viewsController.getLoginForm);
router.get("/signup", viewsController.getSignup);
router.get("/me", authController.protect, viewsController.getAccount);

router.get(
  "/products",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getProducts
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

router.get("/forgot-password", viewsController.getForgotPassword);
router.get("/reset-password/:token", viewsController.getResetPassword);

//router.get('/product/:slug', viewsController.getProduct);
//need to implement  viewsController.getProduct in viewsController

router.get("/dash", viewsController.getDash);

module.exports = router;
