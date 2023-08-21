const express = require("express");
const userRouter = express.Router();
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  updateBanneById,
  updateUnBanneById,
  updatePasswordById,
  forgetPassword,
  resetPassword,
} = require("../controllers/user.controller");
const upload = require("../middlewares/uploadFile");

const {
  validateUserRegistation,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");

const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  resetPassword
);
userRouter.post(
  "/process-register",
  upload.single("image"),
  validateUserRegistation,
  runValidation,

  processRegister
);
userRouter.get("/:id", isLoggedIn, isAdmin, getUserById);
userRouter.delete("/:id", isLoggedIn, isAdmin, deleteUserById);
userRouter.put(
  "/:id",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  updateUserById
);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, updateBanneById);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, updateUnBanneById);
userRouter.put(
  "/update-password/:id",
  isLoggedIn,
  validateUserPasswordUpdate,
  runValidation,
  updatePasswordById
);
userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  forgetPassword
);

userRouter.post("/activate", activateUserAccount);

module.exports = userRouter;
