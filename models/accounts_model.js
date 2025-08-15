const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  phone: String,
  avatar: String,
  role_id: String,
  status: String,
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const Account = mongoose.model("Account", accountSchema, "accounts"); 
// ← dùng "product" (tên collection trong DB)
module.exports = Account;