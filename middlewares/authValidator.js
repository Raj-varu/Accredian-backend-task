const Joi = require("joi");

const authValidator = {
  registerValidator: async (req, res, next) => {
    try {
      const registerSchema = Joi.object({
        name: Joi.string().alphanum().min(1).max(50).required(),
        password: Joi.string()
          .pattern(
            new RegExp(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,30}$/)
          )
          .required(),
        email: Joi.string().email().required(),
        answer: Joi.string().alphanum().required(),
      });

      const userValidate = await registerSchema.validate(req.body);

      // If validation fails
      if (userValidate.error) {
        //TESTING
        // if (userValidate.error.details[0].context.key == "password") {
        //   return res
        //     .status(400)
        //     .json({ error: "password must contain 8 digits" });
        // }
        return res
          .status(400)
          .json({ error: userValidate.error.details[0].message });
      }

      // If validation passes
      next();
    } catch (error) {
      console.error(error);
      // Handle other errors
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  loginValidator: async (req, res, next) => {
    try {
      const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .pattern(
            new RegExp(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,30}$/)
          )
          .required(),
      });
      const loginValidate = await loginSchema.validate(req.body);
      // If validation fails
      if (loginValidate.error) {
        return res
          .status(400)
          .json({ error: loginValidate.error.details[0].message });
      }
      // If validation passes
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  forgotPasswordValidator: async (req, res, next) => {
    try {
      const forgotPasswordSchema = Joi.object({
        newPassword: Joi.string()
          .pattern(
            new RegExp(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,30}$/)
          )
          .required(),
        email: Joi.string().email().required(),
        answer: Joi.string().alphanum().required(),
      });

      const forgotPasswordValidate = await forgotPasswordSchema.validate(
        req.body
      );

      if (forgotPasswordValidate.error) {
        return res
          .status(400)
          .json({ error: forgotPasswordValidate.error.details[0].message });
      }

      // If validation passes
      next();
    } catch (error) {
      console.error(error);
      // Handle other errors
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = authValidator;
