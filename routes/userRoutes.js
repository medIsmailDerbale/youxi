const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

router.patch(
  "/blockUser/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.blockUser
);
router.patch(
  "/activateUser/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.activateUser
);

router.route("/").get(userController.getAllUsers);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
