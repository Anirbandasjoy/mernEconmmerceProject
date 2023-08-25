const { Schema, model } = require("mongoose");
// name , slug , description , price , quantity, sold , shipping , image
const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Product is required , please filup name"],
      trim: true,
      minlength: [3, "The length of Product can be minimam 3 char"],
      maxlength: [150, "The length of Product can be maximam 150 char"],
    },
    slug: {
      type: String,
      required: [true, "Product is required , please filup name"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required , please filup name"],
      trim: true,
      minlength: [3, "The length of Product can be Description 3 char"],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Product Price is required , please filup name"],
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props} not a valid price ! price must be grater then 0`,
      },
    },
    quantity: {
      type: Number,
      trim: true,
      required: [true, "Product quantity is required , please filup name"],
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props} not a valid quantity ! quantity must be grater then 0`,
      },
    },
    sold: {
      type: Number,
      trim: true,
      default: 0,
      required: [true, "Sold quantity is required , please filup name"],
      // validate: {
      //   validator: (v) => v > 0,
      //   message: (props) =>
      //     `${props} not a valid Sold ! Sold quantity must be grater then 0`,
      // },
    },
    shipping: {
      type: Number,
      default: 0,
    },
    image: {
      type: Buffer,
      contentType: "String",
      required: [true, "User Image is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);
module.exports = Product;
