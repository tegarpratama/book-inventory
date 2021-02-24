const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.index = async (req, res, next) => {
   try {
      const users = await User.findAll();

      res.render('main', {
         pageTitle: 'Data User',
         path: '/users',
         view: '/pages/user/index.ejs',
         users: users,
         type: req.flash('type'),
         message: req.flash('message')
      });
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
}

exports.create = (req, res, next) => {
   res.render('main', {
      pageTitle: 'Tambah User Baru',
      path: '/users',
      view: '/pages/user/edit.ejs',
      user: [],
      editing: false,
      hasError: false,
      validationErrors: [],
      type: req.flash('type'),
      message: req.flash('message')
   });
}

exports.store = async (req, res, next) => {
   const errors = validationResult(req);
   const email = req.body.email;
   const password = req.body.password;
   const role = req.body.role;

   if(!errors.isEmpty()) {
      return res.status(422).render('main', {
         pageTitle: 'Tambah User Baru',
         path: '/users',
         view: '/pages/user/edit.ejs',
         editing: false,
         hasError: true,
         user: {
            email: email
         },
         type: 'danger',
         message: errors.array()[0].msg,
         validationErrors: errors.array(),
      });
   }

   try {
      const emailExists = await User.findOne(
         { where: { email: email }}
      );
      
      if (emailExists) {
         req.flash('type', 'danger');
         req.flash('message', 'Gagal menambahkan user baru, email sudah terdaftar');
        return res.redirect('/user');
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const user = new User({
         email: email,
         password: hashedPassword,
         role: role
      });

      await user.save();

      req.flash('type', 'success');
      req.flash('message', 'Berhasil menambahkan user baru');
      res.redirect('/user');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
}

exports.edit = async (req, res, next) => {
   const userId = req.params.userId;

   try {
      const user = await User.findByPk(userId);

      if (!user) {
         req.flash('type', 'danger');
         req.flash('message', 'Data user tidak ditemukan');
         res.redirect('/user');
      }

      res.render('main', {
         pageTitle: 'Ubah User Baru',
         path: '/users',
         view: '/pages/user/edit.ejs',
         user: user,
         editing: true,
         hasError: false,
         validationErrors: [],
         type: req.flash('type'),
         message: req.flash('message')
      });
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
}

exports.update = async (req, res,  next) => {
   const errors = validationResult(req);
   const userId = req.body.userId;
   const email = req.body.email;
   const password = req.body.password;
   const role = req.body.role;

   if(!errors.isEmpty()) {
      return res.status(422).render('main', {
         pageTitle: 'Ubah User Baru',
         path: '/users',
         view: '/pages/user/edit.ejs',
         user: {
            email: email,
            role: role
         },
         editing: true,
         hasError: true,
         type: 'danger',
         message: errors.array()[0].msg,
         validationErrors: errors.array(),
      });
   }

   try {
      const user = await User.findByPk(userId);

      if (!user) {
         req.flash('type', 'danger');
         req.flash('message', 'Data user tidak ditemukan');
         res.redirect('/user');
      }

      user.email = email;
      user.role = role;

      if (password) {
         user.password = await bcrypt.hash(password, 8);
      } else {
         user.password = user.password;
      }

      await user.save();

      res.redirect('/user');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
}

exports.destroy = async (req, res, next) => {
   const userId = req.body.userId;

   try {
      const user = await User.findByPk(userId);
      await user.destroy();

      req.flash('type', 'success');
      req.flash('message', 'User berhasil dihapus');
      res.redirect('/user');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
};