const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", function() {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            const action = path + `/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.action = action;
            formChangeStatus.submit()
        });
    });
}

// Xoá
document.addEventListener("DOMContentLoaded", () => {
    const buttonDelete = document.querySelectorAll("[button-delete]");
    if (buttonDelete.length > 0) {
        const formDeleteItem = document.querySelector("#form-delete-item");
        const path = formDeleteItem.getAttribute("data-path");

        buttonDelete.forEach(button => {
            button.addEventListener("click", () => {
                const isConfirm = confirm("Bạn chắc chắn muốn xoá sản phẩm này?");
                if (isConfirm) {
                    const id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=DELETE`;

                    console.log(action);
                    formDeleteItem.action = action;
                    formDeleteItem.submit();
                }
            });
        });
    }
});

// Xoá mềm

// Sửa sản phẩm
// Lấy dữ liệu để điền sẵn

