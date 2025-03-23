const { body } = require("express-validator");

const productValidator = () => {
  return [
    body("title")
      .isString()
      .withMessage("عنوان باید یک رشته باشد")
      .isLength({ min: 3 })
      .withMessage("عنوان باید حداقل ۳ کاراکتر داشته باشد"),

    body("description")
      .isString()
      .withMessage("توضیحات باید یک رشته باشد")
      .isLength({ min: 10 })
      .withMessage("توضیحات باید حداقل ۱۰ کاراکتر داشته باشد"),


    body("discount")
      .isFloat({ min: 0 })
      .withMessage("تخفیف باید یک عدد بیشتر یا مساوی صفر باشد"),

    body("categoryID")
      .isMongoId()
      .withMessage("شناسه دسته‌بندی باید یک ID معتبر MongoDB باشد"),
  ];
};

module.exports = { productValidator };
