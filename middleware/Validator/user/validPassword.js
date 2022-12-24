const { validationResult, check } = require("express-validator");

const validPassword = [
  check("new_password")
    .trim()
    .notEmpty()
    .withMessage("password must be provide!")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 and should contain at least 1 lowercase, 1 upperCase, 1 number and 1 symbol!"
    ),
];

const validPasswordHandler = (req, res, next) => {
  const errors = validationResult(req);

  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    return next();
  } else {
    return res.status(400).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  validPassword,
  validPasswordHandler,
};
