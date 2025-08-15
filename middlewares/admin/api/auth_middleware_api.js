const jwt = require('jsonwebtoken');
const Accounts = require('../../../models/accounts_model');
const Roles = require('../../../models/role');

// Middleware xác thực cho API (không redirect, không dùng cookie)
module.exports.requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Thiếu token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Accounts.findById(decoded.id).select("-password");
    if (!user || user.deleted) {
      return res.status(401).json({ message: "Token hợp lệ nhưng user không tồn tại" });
    }

    const role = await Roles.findOne({ _id: user.role_id, deleted: false });
    if (!role) {
      return res.status(401).json({ message: "Không tìm thấy role" });
    }

    req.user = user;
    req.role = role;
    next();

  } catch (err) {
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware phân quyền API
module.exports.requirePermission = (permission) => {
  return (req, res, next) => {
    const permissions = req.user?.permissions || req.role?.permissions || [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    next();
  };
};
