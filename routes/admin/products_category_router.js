const express = require('express');
const multer = require('multer');
const router = express.Router();
const streamifier = require('streamifier');
const storageMulter = require('../../helpers/storage_Multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud_middleware');
const validate = require("../../validates/admin/product_category_validate");
const upload = multer();

const product_category_controller = require('../../controller/admin/product_category_controller');
const middlewares = require('../../middlewares/admin/auth_middleware');

// LIST CATEGORIES (product_view)
router.get(
  '/',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_view') : (req, res, next) => next(),
  product_category_controller.index
);

// CREATE - form (require permission product_create)
router.get(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_create') : (req, res, next) => next(),
  product_category_controller.create
);

// CREATE - submit
router.post(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_create') : (req, res, next) => next(),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  product_category_controller.createPost
);

// EDIT - form (product_edit)
router.get(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_edit') : (req, res, next) => next(),
  product_category_controller.edit
);

// EDIT - submit
router.patch(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_edit') : (req, res, next) => next(),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  product_category_controller.editCategory
);

// DELETE (product_delete)
router.delete(
  '/delete/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_delete') : (req, res, next) => next(),
  product_category_controller.deleteCategory
);

module.exports = router;
