// routes/client/index_route.js
const product_route = require('./product_route');
const home_route = require('./home_route');
const search_router = require('./search_router');
const categoryMiddleware = require('../../middlewares/client/category_middleware');
const cartMiddleware = require('../../middlewares/client/cart_middleware');
const cartRouter = require("./cart_router");

module.exports = (app) => {
    app.use(categoryMiddleware);
    app.use(cartMiddleware.cartId);
    app.use('/', home_route);

    app.use('/products', product_route);
    app.use('/cart', cartRouter);
    app.use('/search', search_router);
};
