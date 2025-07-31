const dashboard_route = require('./dashboard_route');
const systems = require('../../config/systems');
const products_route = require('./products_route');
const products_category_router = require('./products_category_router');
const roles_router = require('./role_router');
const accounts_router = require('./accounts_router');
const auth_router = require('./auth_router');
module.exports = (app) => {
    // Use the dashboard route under the admin path
    app.use(systems.prefixAdmin + '/dashboard', dashboard_route);
    
    // Product routes
    app.use(systems.prefixAdmin + '/products', products_route);
    
    // Product category routes
    app.use(systems.prefixAdmin + '/products-category', products_category_router);
    
    // Role routes
    app.use(systems.prefixAdmin + '/roles', roles_router);

    app.use(systems.prefixAdmin + '/accounts', accounts_router);

    app.use(systems.prefixAdmin + '/auth', auth_router);
}
