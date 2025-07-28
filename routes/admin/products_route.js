const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const storageMulter = require('../../helpers/storage_Multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud_middleware');
const upload = multer();
const router = express.Router();
const validate = require("../../validates/admin/products_validate")
const product_controller = require('../../controller/admin/product_controller');

// Define the route for product management
router.get('/', product_controller.products);

router.patch('/change-status/:status/:id', product_controller.changeStatus);
router.patch('/change-multi', product_controller.changeMulti);
router.delete('/delete/:id', product_controller.deleteProduct);

router.get('/create', product_controller.create);
router.post('/create', upload.single('thumbnail'), uploadCloud.upload, validate.createPost, product_controller.createPost);

router.get('/edit/:id', product_controller.edit);
router.patch('/edit/:id', upload.single('thumbnail'), uploadCloud.upload, validate.createPost, product_controller.editProduct);

router.get('/detail/:id', product_controller.detail)

module.exports = router;