const express = require("express");
const controller = require("./auth.controller");
const validator = require("./auth.validator");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.route("/register").post(validator, validate ,controller.register);
router.route("/login").post(controller.login);

module.exports = router;
