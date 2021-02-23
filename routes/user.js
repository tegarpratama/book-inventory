const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, userController.index);

router.get('/tambah-user', isAuth, userController.create);

router.post('/tambah-user', [
   body('email')
      .notEmpty()
      .withMessage('Email tidak boleh kosong')
      .isEmail()
      .withMessage('Email tidak valid')
      .trim(),
   body('password')
      .notEmpty()
      .withMessage('Password tidak boleh kosong')
      .isLength({min: 6})
      .withMessage('Password minimal 6 karakter')
      .trim(),
   body('role')
      .notEmpty()
      .withMessage('Role tidak boleh kosong')
],isAuth, userController.store);

router.get('/ubah-user/:userId', isAuth, userController.edit);

router.post('/ubah-user', [
   body('email')
      .notEmpty()
      .withMessage('Email tidak boleh kosong')
      .isEmail()
      .withMessage('Email tidak valid')
      .trim(),
   body('password')
      .trim(),
   body('role')
      .notEmpty()
      .withMessage('Role tidak boleh kosong')
],isAuth, userController.update);

router.post('/hapus-user', isAuth, userController.destroy);

module.exports = router;