const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/login", viewsController.getLoginForm);
// router.get("/me", viewsController.getAccount);
router.get(
  "/products",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getProducts
);

router.get(
  "/categories",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getCategories
);

//router.get('/product/:slug', viewsController.getProduct);
//need to implement  viewsController.getProduct in viewsController

module.exports = router;
