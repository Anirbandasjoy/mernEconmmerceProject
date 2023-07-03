const express = require("express");
const userRouter = express.Router();
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/user.controller");

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.post("/process-register", processRegister);
userRouter.post("/verify", activateUserAccount);

module.exports = userRouter;
