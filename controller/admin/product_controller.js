
const Product = require('../../models/product_model.js');

const systemConfig = require('../../config/systems.js');
const filteredStatus = require('../../helpers/filterStatus.js'); 
const search = require('../../helpers/search.js'); 
const paginationHelper = require('../../helpers/pagination.js');


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
    const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.limitItems).skip(objectPagination.skip); // Lấy sản phẩm với điều kiện tìm kiếm và phân trang
    
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

// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  
  await Product.updateOne({ _id: id }, { status: status });
  req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// Thay đổi trạng thái của nhiều sản phẩm
// [PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) =>{
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch(type){
    case "active":
      await Product.updateMany({_id: {$in: ids}}, {status: "active"});
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
      break;

    case "inactive":
      await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
      break;
    
    case "delete":
      await Product.updateMany({_id: {$in: ids}}, {deleted: true, deletedAt: new Date()});
      req.flash("success", `Xoá thành công thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for(const item of ids){
        let [id, position] = item.split("-");
        position = parseInt(position);
        console.log(id);
        console.log(position);
        req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm`);
        await Product.updateOne({_id: id}, {position: position});
      }

    default:
      break;
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

//
module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({_id : id}, 
    {
      deleted: true, 
      deletedAt: new Date()
    });
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// Add Product
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        title: "Create Product", // Title of the create product page
    }) // Render create product page
}

module.exports.createPost = async (req, res) => {
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position == ""){
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    }else{
      req.body.position = parseInt(req.body.position);
    }
    // req.body.thumbnail = `/uploads/${req.file.filename}`;
    console.log(req.body);
    // Tạo mới 1 sản phẩm
    const product = new Product(req.body);
    // Lưu sản phẩm vào db
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

module.exports.edit = async (req, res) => {
  console.log(req.params.id);
  const find = {
    deleted: false,
    _id: req.params.id
  };
  const product = await Product.findOne(find);
  console.log(product.description);
  res.render("admin/pages/products/edit", {
    pageTitle: "Trang sửa sản phẩm",
    product: product
  });
}
module.exports.editProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Ép kiểu dữ liệu
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = req.body.position === "" ? 0 : parseInt(req.body.position);

    // Nếu người dùng upload ảnh mới
    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    // Cập nhật sản phẩm
    const updated = await Product.updateOne({_id: id}, req.body);

    if (!updated) {
      req.flash('error', 'Không tìm thấy sản phẩm để cập nhật!');
      return res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    req.flash('success', 'Cập nhật sản phẩm thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật sản phẩm!');
    return res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

module.exports.detail = async (req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);

    res.render('admin/pages/products/detail', {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  }
  catch(error){
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
