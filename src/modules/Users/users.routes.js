const express = require("express");
const controller = require("./users.controller");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

router.route("/").get(auth, isAdmin, controller.allUsers);
router.route("/:id/role").put(auth, isAdmin, controller.changeRole);
router.route("/:id/remove").delete(auth, isAdmin, controller.remove);
router.route("/:id/edit").put(auth, isAdmin, controller.edit);

module.exports = router;