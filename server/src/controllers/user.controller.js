const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { successReponse } = require("./responseContraller");
const { findWithId } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clintUrl } = require("../secret");
const emailWithnodemailer = require("../helper/email");
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        {
          name: { $regex: searchRegExp },
        },
        {
          email: { $regex: searchRegExp },
        },
        {
          phone: { $regex: searchRegExp },
        },
      ],
    };
    const option = { password: 0 };

    const users = await User.find(filter, option)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "user not found");

    return successReponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successReponse(res, {
      statusCode: 200,
      message: "user were returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    const userImagePath = user.image;

    // image delete process

    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successReponse(res, {
      statusCode: 200,
      message: "user was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "User email Already exists , please loged in ");
    }

    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
              <h1> Wellcome ${name} ! </h1>
              <p> Please click here to <a href = "${clintUrl}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
          
          `,
    };

    try {
      // await emailWithnodemailer(emailData);
    } catch (error) {
      next(createError(500, "Faild to send verification email"));
      return;
    }

    return successReponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for  complete your registation process `,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "token not found ");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) createError(401, "Unable to verify user");
      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(409, "User email Already exists , please loged in ");
      }
      await User.create(decoded);

      return successReponse(res, {
        statusCode: 200,
        message: "User Register Successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpireError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
