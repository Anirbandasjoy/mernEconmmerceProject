const User = require("../models/user.model");
const data = require("../data");

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

module.exports = {
  seedingUser,
};
