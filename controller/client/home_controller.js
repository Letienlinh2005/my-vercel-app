module.exports.index = (req, res) => {
  res.render('client/pages/home/index', { // Render html page
    // The path is relative to the views folder
    pageTitle: "Trang chủ"
  });
}