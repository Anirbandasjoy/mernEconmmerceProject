const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");
const isLoggedIn = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new createError(401, "Access token not found please login");
    }
    const decoded = jwt.verify(accessToken, jwtAccessKey);
    if (!decoded) {
      throw createError(403, "Invalid access toke , please login again");
    }
    req.user = decoded.user;
    req.body.isAdmin = decoded.isAdmin;

    next();
  } catch (error) {
    return next(error);
  }
};
const isLoggedOut = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      throw new createError(400, "User already loggedIn");
    }

    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.body.isAdmin) {
      throw createError(403, "Forbidden . You must be an Admin");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
