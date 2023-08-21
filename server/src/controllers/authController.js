const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const User = require("../models/user.model");
const { successReponse } = require("./responseContraller");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const {
  setRefreshTOkenCookie,
  setAccessTokenCookie,
} = require("../helper/cookie");

const handelLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError(400, "Email and password are required.");
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(400, "User not found. Please sign up first.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email/Password combination is incorrect.");
    }

    if (user.isBanned) {
      throw createError(
        403,
        "Your account has been banned. Please contact support."
      );
    }

    const accessToken = createJsonWebToken(
      { _id: user._id, isAdmin: user.isAdmin },
      jwtAccessKey,
      "5m"
    );
    setAccessTokenCookie(res, accessToken);

    // refresh token
    const refreshToken = createJsonWebToken(
      { _id: user._id, isAdmin: user.isAdmin },
      jwtRefreshKey,
      "7d"
    );

    setRefreshTOkenCookie(res, refreshToken);

    const useWithOutPassword = user.toObject();
    delete useWithOutPassword.password;
    console.log(useWithOutPassword);

    successReponse(res, {
      statusCode: 200,
      message: "User LogedIn Successfully",
      payload: { useWithOutPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handelLogOut = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    successReponse(res, {
      statusCode: 200,
      message: "User LogedOut seccessfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
const handelRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if (!decodedToken) {
      throw createError(400, "Invalid refresh token. Please loginIn");
    }

    const accessToken = createJsonWebToken(
      {
        decodedToken,
      },
      jwtAccessKey,
      "1m"
    );
    setAccessTokenCookie(res, accessToken);
    successReponse(res, {
      statusCode: 200,
      message: "New access token is genareted",
    });
  } catch (error) {
    next(error);
  }
};
const handelProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    const decodedToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedToken) {
      throw createError(400, "Invalid access token. Please loginIn");
    }

    successReponse(res, {
      statusCode: 200,
      message: "Protected resource resource accessed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handelLogin,
  handelLogOut,
  handelRefreshToken,
  handelProtectedRoute,
};
