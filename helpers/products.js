module.exports.newPriceProducts = (products) => {
  return products.map((item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discountPercentage) || 0;

    // Tính toán
    const newPrice = (price * (100 - discount)) / 100;

    // Luôn trả về Number (không dùng toFixed)
    item.newPrice = Math.round(newPrice);

    return item;
  });
};

module.exports.newPriceProduct = (product) => {
  const price = Number(product.price) || 0;
  const discount = Number(product.discountPercentage) || 0;

  const newPrice = (price * (100 - discount)) / 100;

  // Trả về Number
  return Math.round(newPrice);
};
