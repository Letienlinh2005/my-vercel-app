const express = require('express');
const router = express.Router();
const product_controller = require('../../controller/admin/product_controller');

// Define the route for product management
router.get('/', product_controller.products);
router.get('/create', product_controller.products); 
router.get('/:id/delete', product_controller.deleteProduct);
module.exports = router;