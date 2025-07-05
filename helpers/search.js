
module.exports = (query) => { // In ra các tham số truy vấn
    let objectKeyword = {
        keyword: "",
    }
    if(query.keyword) {
      objectKeyword.keyword = query.keyword; // Lấy từ khóa tìm kiếm từ query  
      const regex = new RegExp(objectKeyword.keyword, 'i'); // Tạo biểu thức chính quy không phân biệt chữ hoa chữ thường
      objectKeyword.regex = regex; // Tìm kiếm theo từ khóa
    }
    return objectKeyword;
}