const Product = require('../../models/product_model');

// [GET] /api/products
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find({ deleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// [GET] /api/products/:id
exports.getOne = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, deleted: false });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// [POST] /api/products
exports.create = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid data' });
  }
};

// [PUT] /api/products/:id
exports.update = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Update failed' });
  }
};

// [DELETE] /api/products/:id
exports.remove = async (req, res) => {
  try {
    await Product.updateOne({ _id: req.params.id }, { deleted: true });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};
