const express = require('express');
const { body } = require('express-validator');

const masterController = require('../controllers/master');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/buku', isAuth, masterController.index);

router.get('/tambah-buku', isAuth, masterController.create);

router.post('/tambah-buku', [
   body('title')
      .notEmpty()
      .withMessage('Judul buku tidak boleh kosong')
      .isString()
      .trim(),
   body('author')
      .notEmpty()
      .withMessage('Penulis tidak boleh kosong')
      .isString()
      .trim(),
   body('publisher')
      .notEmpty()
      .withMessage('Penerbit tidak boleh kosong')
      .isString()
      .trim(),
   body('totalPages')
      .notEmpty()
      .withMessage('Jumlah halaman tidak boleh kosong')
      .isInt()
      .withMessage('Jumlah halaman harus angka'),
   body('price')
      .notEmpty()
      .withMessage('Harga buku tidak boleh kosong')
      .isFloat()
      .withMessage('Harga buku harus berupa angka'),
   body('stock')
      .notEmpty()
      .withMessage('Stok pages tidak boleh kosong')
      .isInt()
      .withMessage('Stok harus angka'),
   body('description')
      .notEmpty()
      .withMessage('Deskripsi tidak boleh kosong')
      .isString(),
], isAuth, masterController.store);

router.get('/ubah-buku/:bookId', isAuth, masterController.edit)

router.post('/ubah-buku', isAuth, masterController.update);

router.get('/detail-buku/:bookId', isAuth, masterController.show);

router.post('/hapus-buku', isAuth, masterController.destroy);

module.exports = router;
