const express = require('express');
const router = express.Router();
const roles_controller = require('../../controller/admin/role_controller');
const middlewares = require('../../middlewares/admin/auth_middleware');

// LIST ROLES (xem)
router.get(
  '/',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('role_view') : (req, res, next) => next(),
  roles_controller.index
);

// CREATE - form
router.get(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('role_create') : (req, res, next) => next(),
  roles_controller.create
);

// CREATE - submit
router.post(
  '/create',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('role_create') : (req, res, next) => next(),
  roles_controller.createPost
);

// EDIT - form
router.get(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('role_edit') : (req, res, next) => next(),
  roles_controller.edit
);

// EDIT - submit
router.patch(
  '/edit/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('role_edit') : (req, res, next) => next(),
  roles_controller.editRole
);

// PERMISSIONS UI (xem/manage permissions)
router.get(
  '/permissions',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('permission_view') : (req, res, next) => next(),
  roles_controller.permissions
);

// UPDATE PERMISSIONS (submit)
router.patch(
  '/permissions',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('permission_edit') : (req, res, next) => next(),
  roles_controller.permissionPatch
);

// DELETE ROLE
router.delete(
  '/delete/:id',
  middlewares.requireAuth,
  middlewares.requirePermission ? middlewares.requirePermission('role_delete') : (req, res, next) => next(),
  roles_controller.delete
);

module.exports = router;
