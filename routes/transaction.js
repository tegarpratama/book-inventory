const express = require('express');
const { body } = require('express-validator');

const incomeBookController = require('../controllers/enter');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/barang-masuk', isAuth, incomeBookController.index);

router.get('/tambah-barang-masuk', isAuth, incomeBookController.create);

router.post('/tambah-barang', [
   body('bookId')
      .notEmpty()
      .withMessage('Judul buku tidak boleh kosong'),
   body('stockIn')
      .notEmpty()
      .withMessage('Jumlah barang masuk tidak boleh kosong')
      .isInt()
      .withMessage('Jumlah barang masuk harus angka')
], isAuth, incomeBookController.store);

router.post('/hapus-barang-masuk', isAuth, incomeBookController.destroy);

module.exports = router;

