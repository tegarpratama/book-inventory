// import package
const path = require('path');

// import third package
const express = require('express');
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require('body-parser');
const multer = require('multer');
const flash = require('connect-flash');

// import file
const errorController = require('./controllers/error');
const sequelize = require('./config/database');

// import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const masterRoutes = require('./routes/master');
const transactionRoutes = require('./routes/transaction');
const userRoutes = require('./routes/user');

// express
const app = express();

// file storage for image
const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, cb) => {
      cb(null, new Date().getTime() + '-' + file.originalname);
   }
});

// filter package multer
const fileFilter = (req, file, cb) => {
   if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
}

// template engine & views folder
app.set('view engine', 'ejs');
app.set('views', 'views');

// session store in server side
app.use(
   session({
      secret: "keyboard cat",
      saveUninitialized: false,
      store: new SequelizeStore({
         db: sequelize,
      }),
      resave: false, // we support the touch method so per the express-session docs this should be set to false
      proxy: true, // if you do SSL outside of node.
   })
);
// session
app.use(flash());
// body-parser package
app.use(bodyParser.urlencoded({ extended: false}));
// multer package
app.use(
   multer({ storage: fileStorage, fileFilter: fileFilter }).single('cover')
);
// set static directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// set local variables
app.use((req, res, next) => {
   res.locals.isAuth = (req.session.isLoggedIn) ? true : false;
   res.locals.isAdmin = (req.session.userRole === 'admin') ? true : false;
   next();
 });

// routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use('/master', masterRoutes);
app.use('/transaksi', transactionRoutes);
app.use('/user', userRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

// route for error
app.use((error, req, res, next) => {
   res.status(500).render('error/500', {
      pageTitle: 'Something when wrong',
      path: '/500'
   });
});

// migration
const migrate = require('./config/migrate');
migrate.sequelize;

// set port
app.listen(3000);