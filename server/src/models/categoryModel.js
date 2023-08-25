const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required , please filup name"],
      trim: true,
      unique: true,
      minlength: [3, "The length of user can be minimam 3 char"],
    },
    slug: {
      type: String,
      required: [true, "Category is required , please filup name"],
      trim: true,
      lowercase: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);
module.exports = Category;
