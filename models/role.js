const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const roleSchema = new mongoose.Schema({
  title: String, // Sản phẩm 1
  description: String,
  permissions: {
    type: Array,
    default: []
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const role = mongoose.model("Role", roleSchema, "roles"); 
module.exports = role;