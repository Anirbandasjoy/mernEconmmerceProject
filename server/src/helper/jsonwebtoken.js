const jwt = require("jsonwebtoken");

const createJsonWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("payload must be non-empty object");
  }
  if (typeof secretKey !== "string" || secretKey == 0) {
    throw new Error("secretKey must be non-empty string");
  }

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.log("fail to sign in jwt : ", error);
    throw error;
  }
};

module.exports = { createJsonWebToken };
