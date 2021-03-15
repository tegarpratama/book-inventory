const { validationResult } = require('express-validator');

const EnterBook = require('../models/enter');
const Book = require('../models/book');

exports.index = async (req, res, next) => {
   try {
      const enterBooks = await  EnterBook.findAll(
         { include: [{ model: Book }] }
      );
      // const enterBooks = await EnterBook.findAll();
      console.log(enterBooks);

      res.render('main', {
         pageTitle: 'Barang Masuk',
         path: '/transaksi/barang-masuk',
         view: '/pages/transaction/enter.ejs',
         isAdmin: res.locals.isAdmin,
         enterBooks: enterBooks,
         type: req.flash('type'),
         message: req.flash('message')
      });
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   } 
};

exports.create = async (req, res, next) => {
   try {
      const books = await Book.findAll();

      res.render('main', {
         pageTitle: 'Tambah Barang Masuk',
         path: '/transaksi/barang-masuk',
         books: books,
         view: '/pages/transaction/enter-create.ejs',
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

exports.store = async (req, res, next) => {
   const errors = validationResult(req);
   const bookId = +req.body.bookId;
   const stockIn = +req.body.stockIn;

   try {
      const books = await Book.findAll();
      
      if(!errors.isEmpty()) {
         return res.status(422).render('main', {
            pageTitle: 'Tambah Barang Masuk',
            path: '/transaksi/barang-masuk',
            view: '/pages/transaction/enter-create.ejs',
            books: books,
            type: 'danger',
            message: errors.array()[0].msg,
            validationErrors: errors.array(),
         });
      }

      const book = await Book.findByPk(bookId);
      let totalStock = book.stock + stockIn;

      const enterBook = new EnterBook({
         bookId: bookId,
         stockIn: stockIn,
         userId: req.session.userId
      });

      await enterBook.save();
      await book.update(
         { stock: totalStock }, 
         { where: { id: bookId }}
      );

      req.flash('type', 'success');
      req.flash('message', 'Berhasil menambahkan barang masuk');
      res.redirect('/transaksi/barang-masuk');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
}

exports.destroy = async (req, res, next) => {
   const bookId = req.body.bookId;

   try {
      const enterBook = await EnterBook.findByPk(bookId);
      const book = await Book.findByPk(enterBook.bookId);

      let totalStock = book.stock - enterBook.stockIn;

      await book.update(
         { stock: totalStock }, 
         { where: { id: enterBook.bookId }}
      );
      await enterBook.destroy();

      req.flash('type', 'success');
      req.flash('message', 'Barang masuk berhasil dihapus');
      res.redirect('/transaksi/barang-masuk');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
};