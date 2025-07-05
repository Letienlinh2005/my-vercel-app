const dashboard_route = require('./dashboard_route');
const systems = require('../../config/systems');
const products_route = require('./products_route');

module.exports = (app) => {
     // Ensure this is defined in systems.js
    // Use the dashboard route under the admin path
    app.use(systems.prefixAdmin + '/dashboard', dashboard_route);
    
    app.use(systems.prefixAdmin + '/products', products_route);

    app.use(systems.prefixAdmin + '/products/create', products_route);
}