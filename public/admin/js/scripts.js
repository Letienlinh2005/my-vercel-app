// Button status change script
// Lấy ra tất cả các nút có thuộc tính button-status
const ButtonStatus = document.querySelectorAll("[button-status]");

if(ButtonStatus){
    ButtonStatus.forEach((button) => {
        button.addEventListener("click", function() {
            let url = new URL(window.location.href); // Lấy URL hiện tại
            const status = this.getAttribute("button-status"); // Lấy giá trị của thuộc tính button-status
            console.log(status);

            if(status){
                // Nếu có trạng thái, thêm hoặc cập nhật tham số status trong URL
                url.searchParams.set("status", status);
            }else{
                // Nếu không có trạng thái, xóa tham số status
                url.searchParams.delete("status");
            }
            console.log(url.href);
            window.location.href = url.href; // Chuyển hướng đến URL mới
        });
    });
}

// Search form submission script
const searchForm = document.getElementById("searchForm");
if(searchForm){
    searchForm.addEventListener("submit", function(event) {
        let url = new URL(window.location.href); 
        
        event.preventDefault(); // Ngăn chặn hành động mặc định của form
        const keyword = event.target.elements.keyword.value;
        if(keyword) {
            // Thêm tham số tìm kiếm vào URL
            url.searchParams.set("keyword", keyword);
        }else{
            // Nếu không có từ khóa, xóa tham số tìm kiếm
            url.searchParams.delete("keyword");
        }
        console.log(url.href);
        window.location.href = url.href // Chuyển hướng đến URL mới
    });
}

// Cập nhật tham số lên URL khi nhấn nút phân trang
const pagination = document.querySelectorAll("[buttonPagination]");
console.log(pagination);
if(pagination) {
    pagination.forEach((button) => {
        // Thêm sự kiện click cho từng nút phân trang
        button.addEventListener("click", function() {
            let url = new URL(window.location.href); // Lấy URL hiện tại
            const page = this.getAttribute("buttonPagination"); // Lấy giá trị của thuộc tính data-page
            if(page){
                // Nếu có trang, thêm hoặc cập nhật tham số page trong URL
                url.searchParams.set("page", page);
            }
            console.log(url.href);
            window.location.href = url.href; // Chuyển hướng đến URL mới
        });
    });
}

