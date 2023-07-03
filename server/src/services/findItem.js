const createError = require("http-errors");
const mongoose = require("mongoose");

const User = require("../models/user.model");
const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) {
      throw createError(404, `${Model.modelName}item not found this id`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "invalid item id  ");
    }
    throw error;
  }
};
module.exports = { findWithId };
