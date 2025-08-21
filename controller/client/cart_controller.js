// controller/client/cart_controller.js
const Cart = require("../../models/cart_model");
const Product = require("../../models/product_model");
const productHelpers = require("../../helpers/products");

module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: cartId });

        if (cart && cart.products.length > 0) {
            for (const item of cart.products) {
                const productId = item.product_id;
                const productInfo = await Product.findOne({ _id: productId });

                if (!productInfo) continue;

                productInfo.newPrice = productHelpers.newPriceProduct(productInfo);

                item.productInfo = productInfo;

                item.totalPrice = item.quantity * Number(productInfo.newPrice);
            }

            cart.cartTotal = cart.products.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        } else {
            cart.cartTotal = 0;
        }

        res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cartDetail: cart
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Có lỗi xảy ra khi hiển thị giỏ hàng");
        res.redirect(req.get("referer"));
    }
};

module.exports.addPost = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);

        const cart = await Cart.findOne({ _id: cartId });
        const existProductInCart = cart.products.find(item => item.product_id == productId);

        if (existProductInCart) {
            const newQuantity = quantity + existProductInCart.quantity;
            await Cart.updateOne(
                { _id: cartId, "products.product_id": productId },
                { "products.$.quantity": newQuantity }
            );
        } else {
            const objectCart = {
                product_id: productId,
                quantity: quantity
            };
            await Cart.updateOne(
                { _id: cartId },
                { $push: { products: objectCart } }
            );
        }

        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
        res.redirect(req.get("referer"));
    } catch (err) {
        console.error(err);
        req.flash("error", "Có lỗi xảy ra khi thêm sản phẩm");
        res.redirect(req.get("referer"));
    }
};
