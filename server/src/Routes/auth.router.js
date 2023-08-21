const {
  handelLogin,
  handelLogOut,
  handelRefreshToken,
  handelProtectedRoute,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const runValidation = require("../validators");
const { validateUserLogin } = require("../validators/auth");

const authRouter = require("express").Router();

authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handelLogin
);
authRouter.post("/logout", isLoggedIn, handelLogOut);
authRouter.get("/refresh-token", handelRefreshToken);
authRouter.get("/protected", handelProtectedRoute);

module.exports = authRouter;
