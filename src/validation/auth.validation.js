const Joi = require('joi');

const registerValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(10).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(body);
};

const loginValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(body);
};

module.exports = {
  registerValidation,
  loginValidation,
};