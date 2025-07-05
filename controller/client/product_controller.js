const Product = require('../../models/product_model.js');

module.exports.index = async (req, res) => {
  console.log('Vào được controller index');

  try {
    // Truy vấn tất cả sản phẩm có status là "active" và deleted là false
    const products = await Product.find({
      status: "active",
      deleted: false
    });
    console.log(products);
    // Render view với dữ liệu sản phẩm
    res.render('client/pages/products/index', {
      pageTitle: "Trang sản phẩm",
      products: products
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