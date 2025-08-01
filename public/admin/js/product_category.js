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