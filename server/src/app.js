const express = require("express");
const morgan = require("morgan");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const app = express();
const createError = require("http-errors");
const userRouter = require("./Routes/user.router");
const seedRouter = require("./Routes/seed.router");
const { errrorResponse } = require("./controllers/responseContraller");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "To many request form this Ip , please try again later",
});

app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(xssClean());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

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