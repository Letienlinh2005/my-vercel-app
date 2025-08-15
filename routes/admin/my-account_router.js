const express = require('express');
const router = express.Router();
const myaccount_controller = require('../../controller/admin/my-account_controller');
const auth_middleware = require('../../middlewares/admin/auth_middleware')
router.get("/", auth_middleware.requireAuth, myaccount_controller.index);
router.get("/edit", auth_middleware.requireAuth, myaccount_controller.edit);
router.patch("/edit", auth_middleware.requireAuth, myaccount_controller.editPatch);

router.get("/edit-password", auth_middleware.requireAuth, myaccount_controller.editPassword);
router.patch("/edit-password", auth_middleware.requireAuth, myaccount_controller.editPasswordPatch);
module.exports = router;