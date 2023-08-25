const mongoose = require("mongoose");
const logger = require("../controllers/logerController");
const databaseConnection = async (option = {}) => {
  try {
    await mongoose.connect(
      "mongodb://0.0.0.0:27017/MERN_STACK_ECOMMERCE_PROJECT_DB",
      option
    );
    logger.log("info", "db is conneceted successfully");

    mongoose.connection.on("error", () => {
      logger.log("error", "db connection error", error);
    });
  } catch (error) {
    logger.log("error", "could not connected database ", error);
  }
};

module.exports = databaseConnection;
