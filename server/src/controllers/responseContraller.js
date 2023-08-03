const errrorResponse = (
  res,
  { statusCode = 500, message = "Internal server error" }
) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};
const successReponse = (
  res,
  { statusCode = 200, message = "successfull", payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    payload,
  });
};

module.exports = { errrorResponse, successReponse };
