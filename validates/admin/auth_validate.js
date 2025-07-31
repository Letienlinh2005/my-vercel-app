module.exports.loginPost = async (req, res, next) => {
    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email!");
        const referer = req.get('Referer');
        res.redirect(referer);

        return;
    }
    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu!");
        const referer = req.get('Referer');
        res.redirect(referer);

        return;
    }
    next();
}