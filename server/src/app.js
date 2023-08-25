const express = require("express");
const morgan = require("morgan");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const app = express();
const createError = require("http-errors");
const userRouter = require("./Routes/user.router");
const seedRouter = require("./Routes/seed.router");
const { errrorResponse } = require("./controllers/responseContraller");
const authRouter = require("./Routes/auth.router");
const categoryRouter = require("./Routes/category.router");
const productRouter = require("./Routes/product.router");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: "To many request form this Ip , please try again later",
});

app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(xssClean());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

app.use((err, req, res, next) => {
  return errrorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});
module.exports = app;
