const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String, // Sản phẩm 1
  product_category_id: {
    type: String,
    default: ""
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  feature: String,
  slug: {
    type: String,
    slug: "title" // san-pham-1
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  updatedBy: [
    {
      account_id: String,
      updateAt: Date
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    account_id: String,
    deleteAt: {
      type: Date,
      default: Date.now,
    }
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products");
// ← dùng "product" (tên collection trong DB)
module.exports = Product;