const bcyrpt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      type: req.flash('type'),
      message: req.flash('error'),
   });
}

exports.postLogin = async (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   
   try {
      // check email
      const user = await User.findOne({ where: { email: email} });
      if (!user) {
         req.flash('type', 'danger');
         req.flash('error', 'Email atau password salah');
         return res.redirect('/login');
      }

      // check password
      const isMatch = await bcyrpt.compare(password, user.password);
      if (isMatch) {
         await req.session.save();

         req.session.isLoggedIn = true;
         req.session.userId = user.id;
         req.session.userEmail = user.email;
         req.session.userRole = user.role;
         
         req.flash('type', 'success');
         req.flash('message', 'Selamat Datang');
         return res.redirect('/');
      }

      req.flash('type', 'danger');
      req.flash('error', 'Email atau password salah');
      res.redirect('/login');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
}

exports.logout = async (req, res, next) => {
   try {
      await req.session.destroy();
      res.redirect('/login');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
}