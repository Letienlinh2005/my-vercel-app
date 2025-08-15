// Hàm này lấy ra các cấp con của danh mục
let count = 0;

const createTree = (arr, parentId = "") => {
    const tree = [];
    
    arr.forEach((item) => {
        const itemParentId = item.parent_id ? item.parent_id.toString() : "";
        if (itemParentId === parentId) {
            count++;
            const newItem = {...item._doc};
            newItem.index = count;
            newItem.id = item._id.toString(); 

            const children = createTree(arr, item._id.toString());
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
};

module.exports.tree = (arr, parentId = "") => {
    count = 0;
    return createTree(arr, parentId);
};
