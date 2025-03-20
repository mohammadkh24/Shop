const { body } = require("express-validator");

const userValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("نام الزامی است")
    .isLength({ min: 3 }).withMessage("نام باید حداقل ۳ حرف باشد"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("ایمیل الزامی است")
    .isEmail().withMessage("فرمت ایمیل معتبر نیست"),
  
  body("phone")
    .trim()
    .notEmpty().withMessage("شماره تلفن الزامی است")
    .matches(/^\d{10,15}$/).withMessage("شماره تلفن باید بین ۱۰ تا ۱۵ رقم باشد"),
  
  body("password")
    .trim()
    .notEmpty().withMessage("رمز عبور الزامی است")
    .isLength({ min: 6 }).withMessage("رمز عبور باید حداقل ۶ کاراکتر باشد"),
  
  body("role")
    .optional()
    .isIn(["USER", "ADMIN", "DOCTOR"]).withMessage("نقش انتخابی معتبر نیست"),
];

module.exports = userValidator
