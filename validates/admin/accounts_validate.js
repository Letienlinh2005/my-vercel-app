module.exports.createPost = (req, res, next) => {
    if(!req.body.fullName){
      req.flash("error", "Vui lòng nhập đầy đủ họ tên");
      res.redirect("back");
      return;
    }
    next();
}