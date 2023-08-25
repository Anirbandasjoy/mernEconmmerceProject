const logger = require("../controllers/logerController");
const User = require("../models/user.model");
const data = require("../data");
const Product = require("../models/productModel");

const seedingUser = async (req, res, next) => {
  try {
    // Delete all users from the database
    await User.deleteMany({});

    // Insert multiple users into the database
    const users = await User.insertMany(data.users);

    res.status(200).json({
      users,
    });
  } catch (error) {
    // next(error);
    console.log(error.message);
  }
};
const seedingProducts = async (req, res, next) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(data.products);
    res.status(200).json({
      products,
    });
  } catch (error) {
    logger.log("error", error.message);
  }
};

module.exports = {
  seedingUser,
  seedingProducts,
};
