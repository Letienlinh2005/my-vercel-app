// middlewares/client/category_middleware.js
const ProductCategory = require("../../models/product_category_model");
const createTreeHelper = require("../../helpers/createTree");
module.exports = async (req, res, next) => {
    let find = {
        deleted: false,
    }
    const productsCategory = await ProductCategory.find(find);
    const newProductsCategory = createTreeHelper.tree(productsCategory);
    res.locals.layoutProductsCategory = newProductsCategory;
    next();
};
