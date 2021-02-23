const express = require('express');
const { body } = require('express-validator');

const enterBookController = require('../controllers/enter');
const exitBookController = require('../controllers/exit');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// =================== Barang Masuk ======================
router.get('/barang-masuk', isAuth, enterBookController.index);

router.get('/tambah-barang-masuk', isAuth, enterBookController.create);

router.post('/tambah-barang-masuk', [
   body('bookId')
      .notEmpty()
      .withMessage('Judul buku tidak boleh kosong'),
   body('stockIn')
      .notEmpty()
      .withMessage('Jumlah barang masuk tidak boleh kosong')
      .isInt()
      .withMessage('Jumlah barang masuk harus angka')
], isAuth, enterBookController.store);

router.post('/hapus-barang-masuk', isAuth, enterBookController.destroy);

// =================== Barang Keluar ======================
router.get('/barang-keluar', isAuth, exitBookController.index);

router.get('/tambah-barang-keluar', isAuth, exitBookController.create);

router.post('/tambah-barang-keluar', [
   body('bookId')
      .notEmpty()
      .withMessage('Judul buku tidak boleh kosong'),
   body('stockOut')
      .notEmpty()
      .withMessage('Jumlah barang keluar tidak boleh kosong')
      .isInt()
      .withMessage('Jumlah barang keluar harus angka')
], isAuth, exitBookController.store);

router.post('/hapus-barang-keluar', isAuth, exitBookController.destroy);

module.exports = router;

