const jwt = require("jsonwebtoken");
const Accounts = require("../../models/accounts_model");
const Roles = require("../../models/role");
const system = require("../../config/systems");

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    // 1. Kiểm tra có token không
    if (!token) {
        if (refreshToken) {
            return res.redirect(`${system.prefixAdmin}/auth/refresh-token`);
        }
        
        return res.redirect(`${system.prefixAdmin}/auth/login`);
    }

    try {
        // 2. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Kiểm tra người dùng trong DB
        const user = await Accounts.findById(decoded.id).select("-password");
        if (!user || user.deleted) {
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            return res.redirect(`${system.prefixAdmin}/auth/login`);
        }

        // 4. Kiểm tra role
        const role = await Roles.findOne({
            _id: user.role_id,
            deleted: false
        });

        if (!role) {
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            return res.redirect(`${system.prefixAdmin}/auth/login`);
        }

        // 5. Gắn user & role vào `res.locals` và `req`
        res.locals.user = user;
        res.locals.role = role;
        req.user = user;
        req.role = role;

        // 6. Tiếp tục request
        return next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            
            if (refreshToken) {
                return res.redirect(`${system.prefixAdmin}/auth/refresh-token`);
            } else {
                res.clearCookie("token");
                return res.redirect(`${system.prefixAdmin}/auth/login`);
            }
        }

        // 8. Token không hợp lệ (JsonWebTokenError, NotBeforeError, etc.)
        if (err.name === 'JsonWebTokenError') {
            console.log("Token không hợp lệ");
        }

        // 9. Các lỗi khác → xoá tất cả token và quay lại login
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        return res.redirect(`${system.prefixAdmin}/auth/login`);
    }
};

// Middleware để kiểm tra quyền truy cập
module.exports.requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.permissions.includes(permission)) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  };
}

// Middleware để kiểm tra có đang đăng nhập không (không redirect)
module.exports.checkAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        res.locals.role = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Accounts.findById(decoded.id).select("-password");

        if (user && !user.deleted) {
            const role = await Roles.findOne({
                _id: user.role_id,
                deleted: false
            });

            res.locals.user = user;
            res.locals.role = role;
            req.user = user;
            req.role = role;
        } else {
            res.locals.user = null;
            res.locals.role = null;
        }
    } catch (err) {
        res.locals.user = null;
        res.locals.role = null;
    }

    next();
};