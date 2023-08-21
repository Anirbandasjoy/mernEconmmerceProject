require("dotenv").config();

const PORT = process.env.PORT || 3001;
const mongodbUrl =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceDB";

const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "djdjfjdfjdjfjdfjdsjfjewjreerddj";
const jwtAccessKey =
  process.env.JWT_ACCESS_KEY || "kdjfdfjdsjfjdsfgjdsjdfjdsfjdjsfjdsf";
const jwtRefreshKey =
  process.env.JWT_REFRESH_KEY ||
  "kdjfdfjdsjdfdfdfdffdfffjdsfgjdsjdfjdsfjdjsfjdsf";
const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "kdjfdfjdsjfjdsfgjdsjdfjdsfjdjsfjdsf";

const smtpUsername = process.env.SMTP_USERNAME || " ";
const smtpPassword = process.env.SMTP_PASSWORD || " ";
const clintUrl = process.env.CLINT_URL || "http://localhost:3001";

module.exports = {
  PORT,
  mongodbUrl,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clintUrl,
  jwtAccessKey,
  jwtRefreshKey,
  jwtResetPasswordKey,
};
