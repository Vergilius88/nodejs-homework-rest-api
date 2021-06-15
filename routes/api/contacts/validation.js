const Joi = require("joi");

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
<<<<<<< HEAD:routes/api/validation.js
});
=======
  subscription: Joi.string(),
  password: Joi.string(),
}).min(1);
>>>>>>> 9238c084ed70124ebbed0cbdc4f7e154ccd2b699:routes/api/contacts/validation.js

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);

  if (error) {
    const [{ message }] = error.details;

    return next({
      status: 400,
      message: `Not valid data`,
    });
  }
  next();
};
<<<<<<< HEAD:routes/api/validation.js
module.exports.createContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next);
};
module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
=======

module.exports.createContact = (req, res,next) => {

  return validate(schemaCreateContact,req.body,next);
};

module.exports.updateContact = (req, res, next) => {

  return validate(schemaUpdateContact,req.body,next)
};
>>>>>>> 9238c084ed70124ebbed0cbdc4f7e154ccd2b699:routes/api/contacts/validation.js
