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
const User = require('./models/user');
const Book = require('./models/book');
const Enter = require('./models/enter')
const Exit = require('./models/exit');
const sequelize = require('./config/database');


// define express
const app = express();

// set session store in server side
app.use(
   session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new SequelizeStore({
         db: sequelize,
      }),
      resave: false, // we support the touch method so per the express-session docs this should be set to false
      proxy: true, // if you do SSL outside of node.
   })
);

// use session
app.use(flash());


// define file storage for image
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

// set template engine & views folder
app.set('view engine', 'ejs');
app.set('views', 'views');

// import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const masterRoutes = require('./routes/master');
const transactionRoutes = require('./routes/transaction');

// configure body-parser package
app.use(bodyParser.urlencoded({ extended: false}));

// use multer package
app.use(
   multer({ storage: fileStorage, fileFilter: fileFilter }).single('cover')
);

// set static directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Dummy user data
app.use((req, res, next) => {
   User.findByPk(1)
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
});



// routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use('/master', masterRoutes);
app.use('/transaksi', transactionRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

// route for error
// app.use((error, req, res, next) => {
//    res.status(500).render('error/500', {
//       pageTitle: 'Something when wrong',
//       path: '/500'
//    });
// });

// set relation table
User.hasOne(Book);
Book.belongsTo(User);

User.belongsToMany(Book, { through: Enter });
Book.belongsToMany(User, { through: Enter });

User.belongsToMany(Book, { through: Exit });
Book.belongsToMany(User, { through: Exit });

// migrate database
sequelize.sync()
   .then(() => {
      return User.findByPk(1);
   })
   .then(user => {
      if(!user) {
         return User.create({ name: 'Admin', email: 'admin@mail.com', role: 'admin' });
      }
      return user;
   })
   .catch(err => {
      console.log(err);
    });

// set port
app.listen(3000);