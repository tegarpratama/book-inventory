const { validationResult } = require('express-validator');

const EnterBook = require('../models/enter');
const Book = require('../models/book');

exports.index = async (req, res, next) => {
   try {
      const books = await EnterBook.findAll();
      // console.log(books);

      res.render('main', {
         pageTitle: 'Barang Masuk',
         path: '/transaksi/barang-masuk',
         view: '/pages/transaction/enter.ejs',
         books: books,
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
   const books = await Book.findAll();

   res.render('main', {
      pageTitle: 'Tambah Barang Masuk',
      path: '/transaksi/barang-masuk',
      books: books,
      view: '/pages/transaction/enter-create.ejs',
      type: req.flash('type'),
      message: req.flash('message')
   });
}

exports.store = async (req, res, next) => {
   const errors = validationResult(req);
   const books = await EnterBook.findAll();
   const bookId = +req.body.bookId;
   const stockIn = +req.body.stockIn;
   console.log(errors);


   if(!errors.isEmpty()) {
      return res.status(422).render('main', {
         pageTitle: 'Tambah Barang Masuk',
         path: '/transaksi/barang-masuk',
         view: '/pages/transaction/enter-create.ejs',
         books: books,
         // editing: false,
         // hasError: true,
         type: 'danger',
         message: errors.array()[0].msg,
         // validationErrors: errors.array(),
      });
   }

   // const enterBook = new EnterBook({
   //    bookId: bookId,
   //    stockIn: stockIn,
   //    userId: req.user.id
   // });

   // enterBook.save()
   //    .then(() => {
   //       req.flash('type', 'success');
   //       req.flash('message', 'Berhasil menambahkan barang masuk');
   //       res.redirect('/transaksi/barang-masuk');
   //    })
   //    .catch(err => {
   //       const error = new Error(err);
   //       console.log(error);
   //       error.httpStatusCode = 500;
   //       return next(error);
   //    });
}

exports.destroy = async (req, res, next) => {
   const bookId = req.body.bookId;

   try {
      const enterBook = await EnterBook.findByPk(bookId);
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