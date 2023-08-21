const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required , please filup name"],
      trim: true,
      minlength: [3, "The length of user can be minimam 3 char"],
      maxlength: [31, "The length of user can be maximam 3 char"],
    },
    email: {
      type: String,
      required: [true, "name is required , please filup name"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => {
          const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
          return emailRegex.test(v);
        },
        message: "Email validation faild",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Please password min 6 char"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: Buffer,
      contentType: "String",
      required: [true, "User Image is required "],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [3, "Please address min 3 can be 3 charcetar long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v) => {
          const phoneRegex = /^(\+?88)?01[3-9]\d{8}$/;
          return phoneRegex.test(v);
        },
        message: "Please enter a valid Bangladeshi phone number",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
