const { validationResult } = require("express-validator");
const { errrorResponse } = require("../controllers/responseContraller");

const runValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errrorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = runValidation;
