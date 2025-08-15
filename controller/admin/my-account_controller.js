const Accounts = require('../../models/accounts_model');
const Role = require('../../models/role');
const systemConfig = require('../../config/systems');
const bcrypt = require('bcrypt');

module.exports.index = async (req, res) => {
    const id = res.locals.user.id;
    const role_id = res.locals.user.role_id;
    const role = await Role.findOne({ _id: role_id })
    res.render('admin/pages/myaccount/index', {
        title: "Thông tin cá nhân",
        role: role
    });
};
module.exports.edit = async (req, res) => {
    res.render('admin/pages/myaccount/edit', {
        title: "Chỉnh sửa thông tin cá nhân"
    })
}
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    const emailExist = await Accounts.findOne({
        _id: { $ne: id }, // tìm các email khác email của id hiện tại not equal
        email: req.body.email,
        deleted: false,
    });
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại.`);
        return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
    }
    await Accounts.updateOne({ _id: id }, req.body);
    req.flash("success", "Thay đổi thông tin tài khoản thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
}

module.exports.editPassword = async (req, res) => {
    res.render('admin/pages/myaccount/edit-password', {
        title: "Đổi mật khẩu",
    })
}
module.exports.editPasswordPatch = async (req, res) => {
    try {
        const id = res.locals.user.id; // ID của người dùng hiện tại
        const user = await Accounts.findOne({
            _id: id, // Tìm theo ID
            deleted: false
        });

        if (!user) {
            req.flash("error", "Tài khoản không tồn tại!");
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit-password`);
        }

        const checkPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!checkPassword) {
            req.flash("error", "Mật khẩu không chính xác!");
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit-password`);
        }

        if (!req.body.newPassword || !req.body.newPassword2) {
            req.flash("error", "Vui lòng nhập mật khẩu mới!");
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit-password`);
        }

        if (req.body.newPassword === req.body.password) {
            req.flash("error", "Mật khẩu mới không được giống mật khẩu cũ!");
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit-password`);
        }

        if (req.body.newPassword !== req.body.newPassword2) {
            req.flash("error", "Mật khẩu mới không trùng khớp!");
            return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit-password`);
        }

        // At this point, new passwords match, and we can proceed to update it
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedNewPassword;
        
        await user.save();

        req.flash("success", "Cập nhật mật khẩu thành công!");
        return res.redirect(`${systemConfig.prefixAdmin}/my-account`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Đã có lỗi xảy ra!");
        return res.redirect(`${systemConfig.prefixAdmin}/my-account/edit-password`);
    }
};
