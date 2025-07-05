module.exports = (query) =>{
    let filteredStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Không hoạt động",
            status: "inactive",
            class:""
        }
    ];
    if(query.status){
        const index = filteredStatus.findIndex(item => item.status === query.status);
        filteredStatus[index].class = "active"; // Đánh dấu nút đang được chọn

    }
    else{
        const index = filteredStatus.findIndex(item => item.status === "");
        filteredStatus[index].class = "active"; // Đánh dấu nút Tất cả đang được chọn
    }
    return filteredStatus;
}