const Accounts = require('../../models/accounts_model');
const Role = require('../../models/role');
const systemConfig = require('../../config/systems');
const md5 = require('md5');
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Accounts.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;
    };
    res.render("admin/pages/accounts/index", {
        title: "Đây là trang tài khoản",
        records: records,
    });
};

module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };
    const recordsRole = await Role.find(find);
    res.render("admin/pages/accounts/create", {
        title: "Tạo tài khoản",
        recordsRole: recordsRole
    });
};
module.exports.createPost = async (req, res) => {
    const emailExist = await Accounts.findOne({
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại, vui lòng nhập email khác!`);
        const referer = req.get('Referer'); // có thể là undefined

        return res.redirect(referer);
    } else {
        req.body.password = md5(req.body.password);
        const accounts = new Accounts(req.body);

        await accounts.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

module.exports.edit = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    };
    console.log(req.body);
    const records = await Accounts.findOne(find);
    const roles = await Role.find({
        deleted: false,
    })
    res.render('admin/pages/accounts/edit', {
        title: "Sửa nhóm quyền",
        records: records,
        roles: roles
    })
}
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const emailExist = await Accounts.findOne({
        _id: { $ne: id }, // tìm các email khác email của id hiện tại
        email: req.body.email,
        deleted: false,
    })
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại.`)
    }
    else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
    }
    await Accounts.updateOne({ _id: id }, req.body);
    req.flash("success", "Thay đổi thông tin tài khoản thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}