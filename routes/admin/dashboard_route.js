const express = require('express');
const router = express.Router();
const dashboard_controller = require('../../controller/admin/dashboard_controller');
const { requireAuth } = require('../../middlewares/admin/auth_middleware');

router.get('/', requireAuth, dashboard_controller.dashboard);
module.exports = router;