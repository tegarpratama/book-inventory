const { validationResult } = require('express-validator');

const ExitBook = require('../models/exit');
const Book = require('../models/book');

exports.index = async (req, res, next) => {
   try {
      const exitBooks = await ExitBook.findAll(
         {include: [{ model: Book }]}
      );

      res.render('main', {
         pageTitle: 'Barang Keluar',
         path: '/transaksi/barang-keluar',
         view: '/pages/transaction/exit.ejs',
         isAdmin: res.locals.isAdmin,
         exitBooks: exitBooks,
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

exports.create = async (req, res, next) => {
   try {
      const books = await Book.findAll();

      res.render('main', {
         pageTitle: 'Tambah Barang Keluar',
         path: '/transaksi/barang-keluar',
         books: books,
         view: '/pages/transaction/exit-create.ejs',
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
   const stockOut = +req.body.stockOut;

   try {
      const books = await Book.findAll();
     
      if(!errors.isEmpty()) {
         return res.status(422).render('main', {
            pageTitle: 'Tambah Barang Keluar',
            path: '/transaksi/barang-keluar',
            view: '/pages/transaction/exit-create.ejs',
            books: books,
            type: 'danger',
            message: errors.array()[0].msg,
            validationErrors: errors.array(),
         });
      }

      const book = await Book.findByPk(bookId);
      let totalStock = book.stock - stockOut;

      const exitBook = new ExitBook({
         bookId: bookId,
         stockOut: stockOut,
         userId: req.session.userId
      });

      await exitBook.save();
      await book.update(
         { stock: totalStock }, 
         { where: { id: bookId }}
      );

      req.flash('type', 'success');
      req.flash('message', 'Berhasil menambahkan barang keluar');
      res.redirect('/transaksi/barang-keluar');
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
      const exitBook = await ExitBook.findByPk(bookId);
      const book = await Book.findByPk(exitBook.bookId);

      let totalStock = book.stock + exitBook.stockOut;

      await book.update(
         { stock: totalStock }, 
         { where: { id: exitBook.bookId }}
      );
      await exitBook.destroy();

      req.flash('type', 'success');
      req.flash('message', 'Barang keluar berhasil dihapus');
      res.redirect('/transaksi/barang-keluar');
   } catch (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
   }
};