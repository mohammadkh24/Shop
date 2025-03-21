const express = require("express");
const controller = require("./categories.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const multer = require("multer");
const multerStorage = require("../../utils/uploader");
const validator = require("./categories.validator");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.route("/").get(controller.getAll);

router
  .route("/add")
  .post(
      multer({ storage: multerStorage, limits: { fileSize: 300000 } }).single(
        "image"
      ),
    auth,
    isAdmin,
    validator,
    validate,
    controller.add
  );

router
  .route("/:id/edit")
  .patch(
      multer({ storage: multerStorage, limits: { fileSize: 300000 } }).single(
        "image"
      ),
    auth,
    isAdmin,
    validator,
    validate,
    controller.edit
  );
router.route("/:id/remove").delete(auth, isAdmin, controller.remove);

module.exports = router;
