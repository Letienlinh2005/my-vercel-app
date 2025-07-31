const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const storageMulter = require('../../helpers/storage_Multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud_middleware');
const upload = multer(); 
const accounts_controller = require('../../controller/admin/accounts_controller');
const validate = require("../../validates/admin/accounts_validate")

router.get('/', accounts_controller.index);
router.get('/create', accounts_controller.create);
router.post('/create', upload.single('avatar'), uploadCloud.upload, validate.createPost, accounts_controller.createPost);

router.get('/edit/:id', accounts_controller.edit);
router.patch('/edit/:id',upload.single('avatar'), uploadCloud.upload,  accounts_controller.editPatch);

// router.get('/permissions', accounts_controller.permissions);

// router.delete('/delete/:id', accounts_controller.delete);

module.exports = router;