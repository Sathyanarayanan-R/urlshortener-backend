const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

exports.validateSignupUser = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("Enter First Name"),
    lastName: Joi.string().required().label("Enter Last Name"),
    email: Joi.string().email().required().label("Enter email"),
    password: passwordComplexity().required().label("Password"),
    confirmPassword: passwordComplexity().required().label("Confirm Password")
  });

  let { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    return next();
  }
};

exports.validateLoginUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Enter email"),
    password: Joi.string().required().label("Password")
  });

  let { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    return next();
  }
};

exports.validateEmail = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
  });

  let { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    return next();
  }
};

exports.validatePassword = (req, res, next) => {
  const schema = Joi.object({
    password: passwordComplexity().required().label("Password"),
    confirmPassword: passwordComplexity().required().label("Confirm Password")
  });

  let { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    return next();
  }
};

exports.validateUrl = (req, res, next) => {
  const schema = Joi.object({
    longUrl: Joi.string()
      .required()
      .custom((value, helper) => {
        let urlPattern = new RegExp(
          '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
          'i'
        ); // fragment locator

        if (!urlPattern.test(value)) {
          helper.message = 'Please provide a valid url!';
        } else {
          return true;
        }
      }),
  });

  let { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    return next();
  }
};
