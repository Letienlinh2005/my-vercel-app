const Accounts = require('../../models/accounts_model');
const Role = require('../../models/role');
const system = require('../../config/systems');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.login = async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await Accounts.findById(decoded.id).select("-password");

            if (user && !user.deleted) {
                return res.redirect(`${system.prefixAdmin}/dashboard`);
            }

            res.clearCookie("token");
        } catch (err) {
            res.clearCookie("token");
        }
    }

    res.render("admin/pages/auth/login", {
        title: "Trang đăng nhập",
        pageTitle: "Trang đăng nhập"
    });
};

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm tài khoản theo email
        const user = await Accounts.findOne({
            email: email,
            deleted: false
        });

        if (!user) {
            req.flash("error", "Email không tồn tại!");
            return res.redirect(`${system.prefixAdmin}/auth/login`);
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            req.flash("error", "Mật khẩu không chính xác!");
            return res.redirect(`${system.prefixAdmin}/auth/login`);
        }

        // Kiểm tra role
        const role = await Role.findOne({
            _id: user.role_id,
            deleted: false
        });

        if (!role) {
            req.flash("error", "Tài khoản không có quyền truy cập!");
            return res.redirect(`${system.prefixAdmin}/auth/login`);
        }

        // Tạo JWT token với thời gian hợp lý hơn
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                permissions: role.permissions,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Tăng thời gian token lên 1 giờ
        );

        const refreshToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                permissions: role.permissions,
            },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: '7d' } // Giảm refresh token xuống 7 ngày để bảo mật hơn
        );

        // Lưu token vào cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ secure trong production
            path: '/',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 giờ
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        req.flash("success", "Đăng nhập thành công!");
        res.redirect(`${system.prefixAdmin}/dashboard`);

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        req.flash("error", "Có lỗi xảy ra trong quá trình đăng nhập!");
        res.redirect(`${system.prefixAdmin}/auth/login`);
    }
};

module.exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    // Không có refresh token
    if (!refreshToken) {
        return res.status(401).redirect(`${system.prefixAdmin}/auth/login`);
    }

    try {
        // 1. Xác thực refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

        // 2. Tìm lại user từ DB
        const user = await Accounts.findById(decoded.id).select("-password");
        if (!user || user.deleted) {
            res.clearCookie("refreshToken");
            res.clearCookie("token");
            return res.redirect(`${system.prefixAdmin}/auth/login`);
        }

        // 3. Kiểm tra role vẫn hợp lệ
        const role = await Role.findOne({
            _id: user.role_id,
            deleted: false
        });

        if (!role) {
            res.clearCookie("refreshToken");
            res.clearCookie("token");
            return res.redirect(`${system.prefixAdmin}/auth/login`);
        }

        // 4. Tạo access token mới
        const newToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                permissions: role.permissions,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 5. Lưu token mới vào cookie
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1h
        });

        // 6. Redirect trực tiếp thay vì dùng HTML + script
        res.redirect(`${system.prefixAdmin}/dashboard`);
        
    } catch (err) {
        console.log("Refresh token error:", err.message);
        res.clearCookie("refreshToken");
        res.clearCookie("token");
        return res.redirect(`${system.prefixAdmin}/auth/login`);
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect(`${system.prefixAdmin}/auth/login`);
};