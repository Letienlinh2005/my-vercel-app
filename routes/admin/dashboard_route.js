const express = require('express');
const router = express.Router();
const dashboard_controller = require('../../controller/admin/dashboard_controller');

router.get('/', dashboard_controller.dashboard);
module.exports = router;