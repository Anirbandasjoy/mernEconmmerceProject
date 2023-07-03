require("dotenv").config();

const PORT = process.env.PORT || 3001;
const mongodbUrl =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceDB";

const defaultUserProfileImage = process.env.defaultUserProfileImage;
const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "djdjfjdfjdjfjdfjdsjfjewjreerddj";

const smtpUsername = process.env.SMTP_USERNAME || " ";
const smtpPassword = process.env.SMTP_PASSWORD || " ";
const clintUrl = process.env.CLINT_URL || "http://localhost:3000";

module.exports = {
  PORT,
  mongodbUrl,
  defaultUserProfileImage,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clintUrl,
};
