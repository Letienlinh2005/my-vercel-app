const product_route = require('./product_route');
const home_route = require('./home_route');

module.exports = (app) => {
    app.use('/', home_route);
    app.use('/products', product_route);
    app.use('/products/create', product_route);
}