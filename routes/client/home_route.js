const express = require('express');
const router = express.Router();
const home_controller = require('../../controller/client/home_controller');

router.get('/', home_controller.index);


module.exports = router;