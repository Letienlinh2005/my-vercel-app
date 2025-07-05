const express = require('express');
const app = express();

const systems = require('./config/systems.js');
const database = require('./config/database.js');
const routeClient = require('./routes/client/index_route.js');
const routeAdmin = require('./routes/admin/index_route.js');
require('dotenv').config();
const port = process.env.PORT;

database.connect();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

// App local variables
app.locals.prefixAdmin = systems.prefixAdmin;

// Routes
routeClient(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});