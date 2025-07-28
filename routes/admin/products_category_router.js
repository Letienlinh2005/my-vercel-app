const express = require('express');
const multer = require('multer');
const router = express.Router();
const streamifier = require('streamifier');
const storageMulter = require('../../helpers/storage_Multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud_middleware');
const validate = require("../../validates/admin/product_category_validate");
const upload = multer();

const product_category_controller = require('../../controller/admin/product_category_controller');

router.get('/', product_category_controller.index);
router.get('/create', product_category_controller.create);
router.post('/create', upload.single('thumbnail'), uploadCloud.upload, validate.createPost, product_category_controller.createPost);


router.get('/edit/:id', product_category_controller.edit);
router.patch('/edit/:id', upload.single('thumbnail'), uploadCloud.upload, validate.createPost, product_category_controller.editCategory);

router.delete('/delete/:id', product_category_controller.deleteCategory);
module.exports = router;