const express = require('express');
const multer = require('multer');
const upload = multer();
const streamifier = require('streamifier');
const storageMulter = require('../../helpers/storage_Multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud_middleware');

const router = express.Router();
const validate = require("../../validates/admin/products_validate");
const product_controller = require('../../controller/admin/product_controller');
const middlewares = require('../../middlewares/admin/auth_middleware');

// ---------------------------
// LIST / VIEW PRODUCTS
// Yêu cầu: user phải đăng nhập + có permission "product_view"
// ---------------------------
router.get(
  '/',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_view') : (req,res,next)=>next(),
  product_controller.products
);

// ---------------------------
// CHANGE STATUS (single)
// Yêu cầu: product_edit (hoặc product_publish tuỳ app của bạn)
// ---------------------------
router.patch(
  '/change-status/:status/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_edit') : (req,res,next)=>next(),
  product_controller.changeStatus
);

// ---------------------------
// CHANGE MULTI (bulk actions)
// Yêu cầu: product_edit (hoặc product_bulk_edit)
// ---------------------------
router.patch(
  '/change-multi',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_edit') : (req,res,next)=>next(),
  product_controller.changeMulti
);

// ---------------------------
// DELETE PRODUCT
// Yêu cầu: product_delete
// ---------------------------
router.delete(
  '/delete/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_delete') : (req,res,next)=>next(),
  product_controller.deleteProduct
);

// ---------------------------
// CREATE PRODUCT (view + submit)
// - GET: hiển thị form (product_create)
// - POST: upload => validate => create (product_create)
// ---------------------------
router.get(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_create') : (req,res,next)=>next(),
  product_controller.create
);

router.post(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_create') : (req,res,next)=>next(),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  product_controller.createPost
);

// ---------------------------
// EDIT PRODUCT (view + submit)
// - GET: hiển thị form (product_edit)
// - PATCH: upload => validate => edit (product_edit)
// ---------------------------
router.get(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_edit') : (req,res,next)=>next(),
  product_controller.edit
);

router.patch(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_edit') : (req,res,next)=>next(),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  product_controller.editProduct
);

// ---------------------------
// DETAIL (xem chi tiết)
// Yêu cầu: product_view
// ---------------------------
router.get(
  '/detail/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('product_view') : (req,res,next)=>next(),
  product_controller.detail
);

// router.get('/products-featured', middlewares.requireAuth, product_controller.productsFeatured);
module.exports = router;
