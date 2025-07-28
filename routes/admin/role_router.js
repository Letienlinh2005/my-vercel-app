const express = require('express');
const router = express.Router();
const roles_controller = require('../../controller/admin/role_controller');


router.get('/', roles_controller.index);
router.get('/create', roles_controller.create);
router.post('/create', roles_controller.createPost);

router.get('/edit/:id', roles_controller.edit);
router.patch('/edit/:id', roles_controller.editRole);

router.get('/permissions', roles_controller.permissions);

router.delete('/delete/:id', roles_controller.delete);

router.patch('/permissions', roles_controller.permissionPatch)
module.exports = router;