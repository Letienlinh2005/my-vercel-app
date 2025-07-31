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
                };
            });
        });
    };
});

// Xử lý phân quyền cho Danh mục sản phẩm
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener('click', () => {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if (checked) {
                        // Nếu mà được check thì permission[0](admin) mảng trong json sẽ đươc đẩy thêm tên của permision đó
                        permissions[index].permissions.push(name);
                    };
                });
            };
        });
        if (permissions.length > 0) {
            const formChangePermision = document.querySelector("#form-change-permissions");
            const inputPermission = formChangePermision.querySelector("input[name='permissions']");
            inputPermission.value = JSON.stringify(permissions);

            formChangePermision.submit();
        };
    });
};

// hiển thị tick 
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");
    records.forEach((record, index) => {
        const permissions = record.permissions;
        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
        });
    });
};