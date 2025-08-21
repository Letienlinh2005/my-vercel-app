// routes/client/cart_router.js
const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/cart_controller");

// Hiển thị giỏ hàng
router.get("/", controller.index);

router.post("/add/:productId", controller.addPost);

module.exports = router;
