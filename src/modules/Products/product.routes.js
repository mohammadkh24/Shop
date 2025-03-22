const express = require("express");
const controller = require("./product.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const multer = require("multer");
const multerStorage = require("../../utils/uploader");
const { productValidator } = require("./products.validator");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.route("/").get(controller.getAll);

router.route("/:id").get(controller.getOne);
router.route("/category/categoryID").get(controller.getByCategory);
router.route("/discounts").get(controller.getByDiscounts);

router
  .route("/add")
  .post(
    multer({ storage: multerStorage, limits: { fileSize: 300000 } }).single(
      "image"
    ),
    auth,
    isAdmin,
    productValidator(),
    validate,
    controller.add
  );

router
  .route("/:id/edit")
  .put(
    multer({ storage: multerStorage, limits: { fileSize: 300000 } }).single(
      "image"
    ),
    auth,
    isAdmin,
    productValidator(),
    validate,
    controller.edit
  );

router.route("/:id").delete(auth, isAdmin, controller.remove);

module.exports = router;
