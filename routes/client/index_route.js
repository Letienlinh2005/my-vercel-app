// routes/client/index_route.js
const product_route = require('./product_route');
const home_route = require('./home_route');
const categoryMiddleware = require('../../middlewares/client/category_middleware');

module.exports = (app) => {
    app.use(categoryMiddleware);
    app.use('/', home_route);

    app.use('/products', product_route);
};
