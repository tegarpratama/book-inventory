const express = require('express');
const { body } = require('express-validator');

const masterController = require('../controllers/master');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/books', isAuth, masterController.index);

router.get('/add-book', isAuth, masterController.create);

router.post('/add-book', [
   body('title', 'Title is required.')
      .isAlphanumeric()
      .trim(),
   body('author', 'Author is required.')
      .isAlphanumeric()
      .trim(),
   body('publisher', 'Publisher is required')
      .isAlphanumeric()
      .trim(),
   body('description', 'Description is required.')
      .isAlphanumeric(),
   body('price', 'Price is required.')
      .isFloat()
      .withMessage('Price must number.'),
   body('totalPages', 'Total pages is required.')
      .isInt()
      .withMessage('Total pages must number.'),
   body('stock', 'Stock is required.')
      .isInt()
      .withMessage('Stock must number.')
], isAuth, masterController.store);

router.get('/edit-book/:bookId', isAuth, masterController.edit)

router.post('/edit-book', isAuth, masterController.update);

router.get('/detail-book/:bookId', isAuth, masterController.show);

router.post('/delete-book', isAuth, masterController.destroy);

module.exports = router;
