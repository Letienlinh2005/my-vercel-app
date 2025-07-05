const express = require('express');
const router = express.Router();
const product_controller = require('../../controller/client/product_controller');

// route /products
router.get('/', product_controller.index);
router.get('/create', product_controller.create);

module.exports = router;