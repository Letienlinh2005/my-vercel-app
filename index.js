const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const systems = require('./config/systems.js');
const database = require('./config/database.js');
const routeClient = require('./routes/client/index_route.js');
const routeAdmin = require('./routes/admin/index_route.js');
const productsApiRoute = require('./routes/admin_api/product_api_router.js');
const moment = require('moment');
require('dotenv').config();
const port = process.env.PORT || 3000;

database.connect();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));

// Body parser — đặt trước methodOverride để methodOverride có thể đọc req.body
app.use(express.urlencoded({ extended: true })); // thay bodyParser.urlencoded
app.use(express.json());

// Method override — đọc từ body (hidden input `_method`) hoặc query `_method`
app.use(methodOverride('_method'));

// Cookie + session + flash
app.use(cookieParser(process.env.COOKIE_SECRET || 'LETIENLINHHEHE'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat', // **bắt buộc**
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // ví dụ 1 ngày
}));
app.use(flash());

// Tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App local variables
app.locals.prefixAdmin = systems.prefixAdmin;
app.locals.moment = moment;

// Routes
routeClient(app);
routeAdmin(app);


app.use('/api/products', productsApiRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
