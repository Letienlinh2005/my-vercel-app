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
  slug:{
    type: String,
    slug: "title" // san-pham-1
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products"); 
// ← dùng "product" (tên collection trong DB)
module.exports = Product;