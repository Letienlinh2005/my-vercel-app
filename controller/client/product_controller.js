const Product = require('../../models/product_model.js');
const ProductCategory = require('../../models/product_category_model.js');
const systemConfig = require("../../config/systems");
const newPriceHelpers = require('../../helpers/products');
const productCategoryHelpers = require('../../helpers/products_category.js');

module.exports.index = async (req, res) => {
  console.log('Vào được controller index');
  try {
    // Truy vấn tất cả sản phẩm có status là "active" và deleted là false
    const products = await Product.find({
      status: "active",
      deleted: false
    }).sort({ position: "desc" });
    // Tính giá mới
    const newProduct = newPriceHelpers.newPriceProducts(products);
    // Render view với dữ liệu sản phẩm
    res.render('client/pages/products/index', {
      pageTitle: "Trang sản phẩm",
      products: newProduct
    });
  } catch (err) {
    console.error("Lỗi khi truy vấn:", err);
    res.status(500).send("Lỗi server");
  }
};

module.exports.create = (req, res) => {
  console.log('Vào được controller create');
  // Render view tạo sản phẩm
  res.render('client/pages/products/create', {
    pageTitle: "Tạo sản phẩm"
  });
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug
    }
    const product = await Product.findOne(find);

    res.render('client/pages/products/detail', {
      pageTitle: product.title,
      product: product
    });
  }
  catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}

module.exports.category = async (req, res) => {
  console.log(req.params.slugCategory)
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false
  });

  const listSubCategory = await productCategoryHelpers.getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id);
  console.log(listSubCategoryId);
  const products = await Product.find({
    product_category_id: {$in: [category.id, ...listSubCategoryId]},
    deleted: false,
  }).sort({position: "desc"});

  const newProduct = newPriceHelpers.newPriceProducts(products);

  res.render('client/pages/products/index', {
      pageTitle: category.title,
      products: newProduct
    });
}