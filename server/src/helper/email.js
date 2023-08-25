const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
const logger = require("../controllers/logerController");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const emailWithnodemailer = async (emailData) => {
  try {
    const formOption = {
      from: smtpUsername, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(formOption);
    logger.log("info", "message sent : %s", info.response);
  } catch (error) {
    logger.log(
      "error",
      "error ocurred with while sending email ",
      error.message
    );
    throw error;
  }
};

module.exports = emailWithnodemailer;
