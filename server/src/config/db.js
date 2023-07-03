const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");

const databaseConnection = async (option = {}) => {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/testing", option);
    console.log("db is conneceted successfully");

    mongoose.connection.on("error", () => {
      console.log("db connection error", error);
    });
  } catch (error) {
    console.log("could not connected database ", error);
  }
};

module.exports = databaseConnection;
