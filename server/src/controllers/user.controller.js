const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { successReponse } = require("./responseContraller");
const { findWithId } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const {
  jwtActivationKey,
  clintUrl,
  jwtResetPasswordKey,
} = require("../secret");
const emailWithnodemailer = require("../helper/email");
const sendEmail = require("../helper/sendEmail");
const checkUserExists = require("../helper/checkUserExists");
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

    if (!users || users.length) throw createError(404, "user not found");

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
    console.log(req.user);
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
    if (!req.file) {
      createError(400, "image file is required");
    }
    if (req.file.size > 12097152) {
      createError(400, "File too large . It must be less then 2 Mb");
    }
    const imageBufferString = req.file.buffer.toString("base64");

    const userExists = await checkUserExists(email);
    if (userExists) {
      throw createError(409, "User email Already exists , please loged in ");
    }

    const token = createJsonWebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jwtActivationKey,
      "10m"
    );

    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
              <h1> Wellcome ${name} ! </h1>
              <p> Please click here to <a href="${clintUrl}/api/users/activate/${token}" target="_blank"> activate your account </a> </p> 
          `,
    };

    await sendEmail(emailData);
    return successReponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for  complete your registation process `,
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

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};
    const allowedFild = ["name", "password", "phone", "address"];
    for (let key in req.body) {
      if (allowedFild.includes(key)) {
        updates[key] = req.body[key];
      } else if (key == "email") {
        throw new Error("Email can not be updated");
      }
    }

    const image = req.file;

    if (image) {
      if (image > 12097152) {
        createError(400, "File too large . It must be less then 2 Mb");
      }
      updates.image = image.buffer.toString("base64");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(403, "does not updated");
    }
    return successReponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
const updateBanneById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updates = { isBanned: true };
    await findWithId(User, userId);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(403, "does not Banned");
    }

    return successReponse(res, {
      statusCode: 200,
      message: "user was Banned successfully",
    });
  } catch (error) {
    next(error);
  }
};
const updateUnBanneById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updates = { isBanned: false };
    await findWithId(User, userId);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(403, "does not unbanne");
    }

    return successReponse(res, {
      statusCode: 200,
      message: "user was unBanned successfully",
    });
  } catch (error) {
    next(error);
  }
};
const updatePasswordById = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword);
    const userId = req.params.id;
    const user = await findWithId(User, userId);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Old password is incorrect , please try again");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true },
      updateOptions
    );

    if (!updatedUser) {
      throw createError(403, "User does not updated");
    }

    return successReponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(409, "User not found, please register frist ");
    }

    const token = createJsonWebToken({ email }, jwtResetPasswordKey, "10m");

    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
              <h1> Wellcome ${userData.name} ! </h1>
              <p> Please click here to <a href="${clintUrl}/api/users/reset-password/${token}" target="_blank"> Reset your password </a> </p> 
          `,
    };

    await sendEmail(emailData);

    return successReponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for  complete your password reset  process `,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, jwtResetPasswordKey);
    if (!decoded) {
      throw createError(404, "invalid token or explair token");
    }

    const fileter = { email: decoded.email };
    const update = { password: password };
    const option = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      fileter,
      update,
      option
    ).select("-password");

    if (!updatedUser) {
      throw createError(403, "Password reset failed");
    }

    return successReponse(res, {
      statusCode: 200,
      message: "Password reset successfully",
    });
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
  updateUserById,
  updateBanneById,
  updateUnBanneById,
  updatePasswordById,
  forgetPassword,
  resetPassword,
};
