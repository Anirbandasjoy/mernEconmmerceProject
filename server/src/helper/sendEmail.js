const createError = require("http-errors");
const sendEmail = async (emailData) => {
  try {
    await emailWithnodemailer(emailData);
  } catch (error) {
    createError(500, "Faild to send verification email");
  }
};

module.exports = sendEmail;
