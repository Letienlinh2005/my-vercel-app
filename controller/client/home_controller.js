const Product = require('../../models/product_model');
const newPriceHelpers = require('../../helpers/products');
module.exports.index = async (req, res) => {
  const find = {
    feature: 'featured',
    deleted: false,
  };
  const featured = await Product.find(find);
  const newProduct = newPriceHelpers.newPriceProducts(featured)
  res.render('client/pages/home/products-featured', { 
    pageTitle: "Trang chủ",
    productsFeature: newProduct
  });
};