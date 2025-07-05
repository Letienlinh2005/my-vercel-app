
const Product = require('../../models/product_model.js');

const filteredStatus = require('../../helpers/filterStatus.js'); 
const search = require('../../helpers/search.js'); 
const paginationHelper = require('../../helpers/pagination.js');
module.exports.create = (req, res) => {
    res.render('admin/pages/products/create', {
        title: "Create Product", // Title of the create product page
    }) // Render create product page
}

module.exports.products = async (req, res) => {
  try {
    
    console.log("Query parameters:", req.query); // In ra các tham số truy vấn
    const filter = filteredStatus(req.query); // Lọc trạng thái nếu có
    
    let find = {
      deleted: false
      // find.title sẽ ở đây
      // find.status sẽ ở đây
    }
    if(req.query.status) {
      find.status = req.query.status; // Lọc theo trạng thái nếu có
    }
    // tìm kiếm
    const objectSearch = search(req.query);
    if(objectSearch.regex) {
      find.title = objectSearch.regex; // Tìm kiếm theo từ khóa
      console.log("Search object:", objectSearch.regex); // In ra đối tượng tìm kiếm
    }

    // Pagination
    const countProducts = await Product.countDocuments(find); // Đếm số lượng sản phẩm  
    let objectPagination = paginationHelper(
      {
        currentPage: 1, 
        limitItems: 4,
      },
      req.query,
      countProducts
    );
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip); // Lấy sản phẩm với điều kiện tìm kiếm và phân trang

    
    // Render view với dữ liệu sản phẩm
    res.render('admin/pages/products/index', {
      pageTitle: "Trang sản phẩm",
      products: products,
      filterStatus: filter, // Truyền dữ liệu trạng thái đã lọcx
      keyword: objectSearch.keyword, // Truyền từ khóa tìm kiếm
      pagination: objectPagination 
    });
  } catch (err) {
    console.error("Lỗi khi truy vấn:", err);
    res.status(500).send("Lỗi server");
  }
};


exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId); // hoặc Product.deleteOne({ _id: productId })
        res.redirect('/admin/products'); // về lại trang danh sách
    } catch (err) {
        console.error('Xóa sản phẩm lỗi:', err);
        res.status(500).send('Lỗi server khi xóa sản phẩm');
    }
};
