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

exports.postLogin = async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   
   try {
      const user = await User.findOne({ where: { email: email} });
      const isMatch = await bcyrpt.compare(password, user.password);

      if (!user) {
         req.flash('type', 'danger');
         req.flash('error', 'Account not found');
         return res.redirect('/login');
      }

      if (isMatch) {
         await req.session.save();
         req.session.isLoggedIn = true;
         req.session.user = user;
         req.flash('type', 'primary');
         req.flash('message', 'Welcome Back!');
         return res.redirect('/');
      }

      req.flash('type', 'danger');
      req.flash('error', 'Account not found');
      res.redirect('/login');
   } catch (err) {
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