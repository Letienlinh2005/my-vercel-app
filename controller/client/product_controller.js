const Product = require('../../models/product_model.js');

module.exports.index = async (req, res) => {
  console.log('Vào được controller index');
  try {
    // Truy vấn tất cả sản phẩm có status là "active" và deleted là false
    const products = await Product.find({
      status: "active",
      deleted: false
    }).sort({position: "desc"});
    console.log(products);
    // Tính giá mới
    const newProducts = products.map((item)=>{
      item.newPrice = (
        (item.price*(100-item.discountPercentage))/100).toFixed(0);
      return item;
    });
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

module.exports.detail = async (req, res) => {
  try{
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
  catch(error){
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}