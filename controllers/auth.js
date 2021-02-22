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
   console.log(password);
   
   try {
      const user = await User.findOne({ where: { email: email} });
      const isMatch = await bcyrpt.compare(password, user.password);

      if (!user) {
         req.flash('type', 'danger');
         req.flash('error', 'Email atau password salah');
         return res.redirect('/login');
      }

      if (isMatch) {
         await req.session.save();
         req.session.isLoggedIn = true;
         req.session.user = user;
         req.flash('type', 'success');
         req.flash('message', 'Selamat Datang');
         return res.redirect('/');
      }

      req.flash('type', 'danger');
      req.flash('error', 'Email atau password salah');
      res.redirect('/login');
   } catch (err) {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   }
}

exports.logout = async (req, res, next) => {
   try {
      await req.session.destroy();;
      res.redirect('/login');
   } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   }
}