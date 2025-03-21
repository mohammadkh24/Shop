const { body } = require("express-validator");

const categoryValidator = [
  body("title")
    .notEmpty()
    .withMessage("عنوان دسته‌بندی نمی‌تواند خالی باشد")
    .isString()
    .withMessage("عنوان دسته‌بندی باید یک رشته باشد")
    .trim()
    .escape(),

//   body("image")
//     .notEmpty()
//     .withMessage("تصویر دسته‌بندی نمی‌تواند خالی باشد")
//     .isString()
//     .withMessage("آدرس تصویر باید یک رشته معتبر باشد"),
];

module.exports = categoryValidator
