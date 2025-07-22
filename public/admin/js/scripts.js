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
if(pagination) {
    pagination.forEach(button => {
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
// Checkbox Multi
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if(checkBoxMulti){
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']"); 
    const inputId = checkBoxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked){
            inputId.forEach(input=>{
                input.checked = true;
            })
        }
        else{
            inputId.forEach(input => {
                input.checked = false;
            })
        }
    });

    inputId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = document.querySelectorAll("input[name='id']:checked").length;
            if(countChecked === inputId.length){
                inputCheckAll.checked = true;
            }else{
                inputCheckAll.checked = false;
            }
        })
    })
}

// Thay đổi trạng thái sản phẩm
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputsChecked = document.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        if(typeChange == "delete"){
            const isConfirm = confirm("Bạn có chắc chắn muốn xoá những sản phẩm này?");
            if(!isConfirm){
                return;
            }
        }
        if(inputsChecked.length > 0){
            let ids = [];

            const inputIds = document.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                if(typeChange == "change-position"){
                    
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    console.log(`${id}-${position}`);
                }else{
                    ids.push(id);
                }
            });
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        }else{
            alert("Vui lòng chọn ít nhất một sản phẩm!");
        }
    })
}

//showAlert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const close = showAlert.querySelector("[close-alert]");
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden");
    }, time);

    close.addEventListener("click", ()=>{
        showAlert.classList.add("alert-hidden");
    })
}

// Preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const imagePreview = document.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener("change", (e) => {
        console.log(e);
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            imagePreview.src = imageUrl;
        }
    });
}
