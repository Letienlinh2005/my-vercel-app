const express = require("express");
const router = express.Router();

const auth_controller = require("../../controller/admin/auth_controller");

const validate = require("../../validates/admin/auth_validate");

router.get("/login", auth_controller.login);
router.post("/login", validate.loginPost, auth_controller.loginPost);

router.get("/logout", auth_controller.logout)
module.exports = router;