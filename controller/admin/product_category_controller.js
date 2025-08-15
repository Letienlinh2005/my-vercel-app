const ProductCategory = require("../../models/product_category_model");
const Accounts = require("../../models/accounts_model");
const systemConfig = require('../../config/systems');
const createTreeHelper = require('../../helpers/createTree');

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);

  for(const record of records){
    if(!record.createdBy || !record.createdBy.account_id){
      record.createdBy.account_id = "";
    }else{
      const user = await Accounts.findOne({
        _id: record.createdBy.account_id,
        deleted: false,
      });
      if(user){
        record.accountFullname = user.fullName;
      }else{
        record.accountFullname = "";
      }
    }
  }
  res.render('admin/pages/products-category/index', {
    title: 'Category',
    records: newRecords
  });
}

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  
  console.log(newRecords);
  res.render('admin/pages/products-category/create', {
    title: 'Create category',
    records: newRecords
  });
}

module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  // Tạo mới 1 sản phẩm
  req.body.createdBy = {
    account_id: res.locals.user.id,
  }
  console.log(req.body);
  const productCategory = new ProductCategory(req.body);
  // Lưu sản phẩm vào db
  await productCategory.save();
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

module.exports.edit = async (req, res) => {
  console.log(req.params.id);
  const find = {
    deleted: false,
    _id: req.params.id
  };
  const productCategory = await ProductCategory.findOne(find);

  const allRecords = await ProductCategory.find({ deleted: false });
  const treeRecords = createTreeHelper.tree(allRecords);

  res.render("admin/pages/products-category/edit", {
    pageTitle: "Trang cập nhật danh mục sản phẩm",
    category: productCategory,
    records: treeRecords
  });
}

module.exports.editCategory = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.position = req.body.position === "" ? 0 : parseInt(req.body.position);

    const updatedBy = {
      account_id: res.locals.user.id,
      updateAt: new Date(),
    }
    // Cập nhật sản phẩm
    const updated = await ProductCategory.updateOne({ _id: id }, {
      $set: req.body,
      $push: {updatedBy: updatedBy}
    });

    if (!updated) {
      req.flash('error', 'Không tìm thấy danh mục sản phẩm để cập nhật!');
      return res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
    req.flash('success', 'Cập nhật danh mục sản phẩm thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật danh mục sản phẩm!');
    return res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

module.exports.deleteCategory = async (req, res) => {
  const id = req.params.id;

  const deletedBy = {
    account_id: res.locals.user.id,
    deleteAt: new Date()
  }
  await ProductCategory.updateOne({ _id: id },
    {
      deleted: true,
      deletedBy: deletedBy
    });
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}