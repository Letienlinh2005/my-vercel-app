const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String, // Sản phẩm 1
  parent_id: {
    type: String,
    default: ""
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  updatedBy: {
    account_id: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  slug:{
    type: String,
    slug: "title", // san-pham-1
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    account_id: String,
    deletedAt: {
      type: Date,
      default: Date.now,
    }
  }]
  
}, {
  timestamps: true
});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category"); 
// ← dùng "product" (tên collection trong DB)
module.exports = ProductCategory;