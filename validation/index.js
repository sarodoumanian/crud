const Joi = require("joi");

module.exports = {
  userSignUpEndpoint: {
    body: Joi.object({
      username: Joi.string().max(75).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(4).max(32),
      role: Joi.string().valid("admin", "user").default("user").optional()
    })
  },
  userSignInEndpoint: {
    body: Joi.object({
      username: Joi.string().max(75).required(),
      password: Joi.string().required().min(4).max(32)
    })
  },
  changePasswordEndpoint: {
    body: Joi.object({
      oldPassword: Joi.string().required().min(4).max(32),
      newPassword: Joi.string().required().min(4).max(32),
      confirmPassword: Joi.string().required().min(4).max(32)
    })
  },
  createComponentEndpoint: {
    body: Joi.object({
      title: Joi.string().required().min(4).max(50),
      code: Joi.string().required().min(4).max(1500),
      catagory: Joi.string().required().min(4).max(25),
      subcatagory: Joi.string().required().min(4).max(25)
    })
  }
};
