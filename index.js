const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const systems = require('./config/systems.js');
const database = require('./config/database.js');
const routeClient = require('./routes/client/index_route.js');
const routeAdmin = require('./routes/admin/index_route.js');
require('dotenv').config();
const port = process.env.PORT;

database.connect();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');


console.log(__dirname);

app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extended:false}));

// Flash
app.use(cookieParser('LETIENLINHHEHE'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// Tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App local variables
app.locals.prefixAdmin = systems.prefixAdmin;

// Routes
routeClient(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});