const express = require('express');
const { body } = require('express-validator');

const masterController = require('../controllers/master');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/books', isAuth, masterController.index);

router.get('/add-book', isAuth, masterController.create);

router.post('/add-book', [
   body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .trim(),
   body('author')
      .notEmpty()
      .withMessage('Author is required')
      .isString()
      .trim(),
   body('publisher')
      .notEmpty()
      .withMessage('Publisher is required')
      .isString()
      .trim(),
   body('totalPages')
      .notEmpty()
      .withMessage('Total pages is required')
      .isInt()
      .withMessage('Total pages must number.'),
   body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat()
      .withMessage('Price must number.'),
   body('stock')
      .notEmpty()
      .withMessage('Stock pages is required')
      .isInt()
      .withMessage('Stock must number.'),
   body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isString(),
], isAuth, masterController.store);

router.get('/edit-book/:bookId', isAuth, masterController.edit)

router.post('/edit-book', isAuth, masterController.update);

router.get('/detail-book/:bookId', isAuth, masterController.show);

router.post('/delete-book', isAuth, masterController.destroy);

module.exports = router;
