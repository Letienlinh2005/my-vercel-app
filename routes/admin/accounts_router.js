const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const storageMulter = require('../../helpers/storage_Multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud_middleware');
const upload = multer(); 
const accounts_controller = require('../../controller/admin/accounts_controller');
const validate = require("../../validates/admin/accounts_validate");
const middlewares = require('../../middlewares/admin/auth_middleware');

// LIST ACCOUNTS (account_view)
router.get(
  '/',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('account_view') : (req, res, next) => next(),
  accounts_controller.index
);

// CREATE - form (account_create)
router.get(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('account_create') : (req, res, next) => next(),
  accounts_controller.create
);

// CREATE - submit
router.post(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('account_create') : (req, res, next) => next(),
  upload.single('avatar'),
  uploadCloud.upload,
  validate.createPost,
  accounts_controller.createPost
);

// EDIT - form (account_edit)
router.get(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('account_edit') : (req, res, next) => next(),
  accounts_controller.edit
);

// EDIT - submit
router.patch(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('account_edit') : (req, res, next) => next(),
  upload.single('avatar'),
  uploadCloud.upload,
  accounts_controller.editPatch
);

// (Optional) delete / permissions routes — thêm tương tự nếu cần

module.exports = router;