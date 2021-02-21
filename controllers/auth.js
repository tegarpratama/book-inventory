const bcyrpt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
   let message = req.flash('error');

   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }

   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message
   });
}

exports.postLogin = async (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   
   try {
      const user = await User.findOne({ where: { email: email} });

      if (!user) {
         req.flash('error', 'Account not found');
         return res.redirect('/login');
      }

      const isMatch = await bcyrpt.compare(password, user.password);

      if (isMatch) {
         req.session.isLoggedIn = true;
         req.session.user = user;
         await req.session.save()
         return res.redirect('/');
      }

      req.flash('error', 'Account not found');
      res.redirect('/login');
   } catch (error) {
      console.log(error);
      res.redirect('/login');
   }
}

exports.logout = (req, res, next) => {
   req.session.destroy(err => {
      res.redirect('/login');
   });
}