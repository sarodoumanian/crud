const { ValidationError } = require("express-validation");

module.exports = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    let errorMessage = Object.keys(err.details).reduce((errMessage, errKey) => {
      const errors = err.details[errKey].map((e) => e.message).join(". ");
      return `${errMessage}${errors}`;
    }, "");
    if (errorMessage.includes("email")) {
      errorMessage = "Email address is not valid";
    }
    return res.status(400).json(errorMessage);
  }

  return next(err);
};
