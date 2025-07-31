const Accounts = require("../../models/accounts_model");
const md5 = require('md5');
const system = require("../../config/systems");
module.exports.login = async (req, res) => {
    res.render("admin/pages/auth/login", {
        title: "Trang đăng nhập",
        pageTitle: "Trang đăng nhập"
    })
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
    const user = await Accounts.findOne({
        email: email,
        deleted: false,
    })
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        const referer = req.get('Referer');
        res.redirect(referer);
        return;
    } else {
        if (md5(password) != user.password) {
            req.flash("error", "Sai mật khẩu, vui lòng nhập lại mật khẩu!");
            const referer = req.get('Referer');
            res.redirect(referer);
            return;
        }
    }
    if (user.status != "active") {
        req.flash("error", "Tài khoản đã bị khoá!");
        const referer = req.get('Referer');
        res.redirect(referer);
        return;
    }
    res.cookie("token", user.token);
    res.redirect(`${system.prefixAdmin}/dashboard`);
}

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${system.prefixAdmin}/auth/login`);
}