module.exports = (objectPagination, query, countProducts) => {
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page); // Lấy trang hiện tại từ tham số truy vấn
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems; // Tính toán số mục cần bỏ qua

    const totalPages = Math.ceil(countProducts / objectPagination.limitItems); // Tính tổng số trang
    objectPagination.totalPages = totalPages; // Lưu tổng số trang vào đối tượng phân trang

    return objectPagination; // Trả về đối tượng phân trang đã cập nhật
}