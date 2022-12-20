const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const User = require("../../../models/User/User");

// Express validation
const addUserValidators = [
  check("username").notEmpty().withMessage("Username is required!").trim(),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email should not be empty")
    .isEmail()
    .withMessage("Invalid email address!")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });

        if (user && user.provider !== "user") {
          throw createError(`Your account created with Google/Facebook!`);
        }

        if (user) {
          throw createError(`Your Email already used.`);
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 and should contain at least 1 lowercase, 1 upperCase, 1 number and 1 symbol!"
    ),
];

const addUserValidatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  addUserValidators,
  addUserValidatorHandler,
};
