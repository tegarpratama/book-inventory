const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAuth, isAdmin, userController.index);

router.get('/tambah-user', isAuth, isAdmin, userController.create);

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
],isAuth, isAdmin, userController.store);

router.get('/ubah-user/:userId', isAuth, isAdmin, userController.edit);

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
],isAuth, isAdmin, userController.update);

router.post('/hapus-user', isAuth, isAdmin, userController.destroy);

module.exports = router;