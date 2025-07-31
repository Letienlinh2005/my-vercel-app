const Role = require('../../models/role');
const systemConfig = require('../../config/systems.js');

module.exports.index = async (req, res) => {
    let find = {
        deleted: false,

    }
    const records = await Role.find(find);
    res.render('admin/pages/roles/index', {
        title: "Nhóm quyền",
        records: records
    })
}

module.exports.create = async (req, res) => {
    res.render('admin/pages/roles/create', {
        title: "Tạo nhóm quyền"
    })
}
module.exports.createPost = async (req, res) => {
    const role = new Role(req.body);

    await role.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

module.exports.edit = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    };
    const records = await Role.findOne(find);
    res.render('admin/pages/roles/edit', {
        title: "Cập nhật nhóm quyền",
        records: records
    })
}

module.exports.editRole = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await Role.updateOne({ _id: id }, req.body);
        if (!updated) {
            req.flash('error', 'Không tìm thấy sản phẩm để cập nhật!');
            return res.redirect(`${systemConfig.prefixAdmin}/roles`);
        }
        req.flash('success', 'Cập nhật sản phẩm thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        req.flash('error', 'Đã xảy ra lỗi khi cập nhật sản phẩm!');
        return res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({ _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        });
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Role.find(find);

    res.render('admin/pages/roles/permissions', {
        pageTitle: "Phân quyền",
        records: records
    });
};

module.exports.permissionPatch = async (req, res) => {
    const permission = JSON.parse(req.body.permissions);
    
    for(const item of permission){
        const id = item.id;
        const permissions = item.permissions; 
        await Role.updateOne({_id: id}, {permissions: permissions});
    }
    req.flash("success", "Cập nhật quyền cho tài khoản thành công");
    res.redirect("/admin/roles/permissions")
}