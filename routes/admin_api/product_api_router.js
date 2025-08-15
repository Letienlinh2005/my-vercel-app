const express = require('express');
const router = express.Router();
const controller = require('../../controller/api/product_api_controller');
const { requireAuth, requirePermission } = require('../../middlewares/admin/api/auth_middleware_api');

router.get('/', controller.getAll); // Public
router.get('/:id', controller.getOne); // Public

// Cần token + quyền
router.post('/', requireAuth, requirePermission("product_create"), controller.create);
router.put('/:id', requireAuth, requirePermission("product_edit"), controller.update);
router.delete('/:id', requireAuth, requirePermission("product_delete"), controller.remove);

module.exports = router;
