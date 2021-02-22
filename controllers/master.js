const { validationResult } = require('express-validator');

const Book = require('../models/book');
const fileHelper = require('../config/file.js');

exports.index = async (req, res, next) => {
   try {
      const books = await Book.findAll();

      res.render('main', {
         pageTitle: 'Data Buku',
         path: '/master',
         view: '/pages/master/books.ejs',
         books: books,
         type: req.flash('type'),
         message: req.flash('message')
      });
   } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   } 
};

exports.create = (req, res, next) => {
   res.render('main', {
      pageTitle: 'Tambah Buku',
      path: '/master',
      view: 'pages/master/edit-book.ejs',
      editing: false,
      hasError: false,
      type: '',
      message: [],
      validationErrors: [],
   });
};

exports.store = (req, res, next) => {
   const errors = validationResult(req);
   const title = req.body.title;
   const author = req.body.author;
   const publisher = req.body.publisher;
   const totalPages = req.body.totalPages;
   const price = req.body.price;
   const stock = req.body.stock;
   const description = req.body.description;
   let cover;
   
   if(!errors.isEmpty()) {
      return res.status(422).render('main', {
         pageTitle: 'Tambah Book',
         path: '/master',
         view: '/pages/master/edit-book.ejs',
         editing: false,
         hasError: true,
         book: {
            title: title,
            author: author,
            publisher: publisher,
            totalPages: totalPages,
            price: price,
            stock: stock,
            description: description,
         },
         type: 'danger',
         message: errors.array()[0].msg,
         validationErrors: errors.array(),
      });
   }

   if (req.file) {
      cover = req.file.path.replace(/\\/g, "/");
   } else {
      cover = '';
   }

   const book = new Book({
      title: title,
      author: author,
      publisher: publisher,
      totalPages: totalPages,
      price: price,
      stock: stock,
      description: description,
      cover: cover,
      userId: req.user.id
   });
   
   book.save()
      .then(() => {
         req.flash('type', 'success');
         req.flash('message', 'Berhasil menambahkan data buku baru');
         res.redirect('/master/buku');
      })
      .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
      });
};

exports.edit = async (req, res, next) => {
   const bookId = req.params.bookId;

   try {
      const book = await Book.findByPk(bookId, { userId: req.user.id })

      if(!book) {
         req.flash('type', 'danger');
         req.flash('message', 'Buku tidak ditemukan');
         return res.redirect('/master/buku');
      }

      res.render('main', {
         pageTitle: 'Ubah Buku',
         path: '/master',
         view: 'pages/master/edit-book.ejs',
         editing: true,
         book: book,
         hasError: false,
         type: '',
         message: [],
         validationErrors: [],
      });
   } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   }
};

exports.update = async (req, res, next) => {
   const errors = validationResult(req);
   const bookId = req.body.bookId;
   const title = req.body.title;
   const author = req.body.author;
   const publisher = req.body.publisher;
   const totalPages = req.body.totalPages;
   const price = req.body.price;
   const stock = req.body.stock;
   const description = req.body.description;
   const cover = req.file;

   if(!errors.isEmpty()) {
      return res.status(422).render('main', {
         pageTitle: 'Ubah Book',
         path: '/master',
         view: 'pages/master/edit-book.ejs',
         editing: true,
         hasError: true,
         book: {
            id: bookId,
            title: title,
            author: author,
            publisher: publisher,
            totalPages: totalPages,
            price: price,
            stock: stock,
            description: description,
         },
         type: 'danger',
         message: errors.array()[0].msg,
         validationErrors: errors.array(),
      });
   }

   try {
      const book = await Book.findByPk(bookId);
      book.title = title;
      book.author = author;
      book.publisher = publisher;
      book.totalPages = totalPages;
      book.price = price;
      book.stock = stock;
      book.description = description;
      book.userId = req.user.id;

      if(cover) {
         fileHelper.deleteFile(book.cover);
         book.cover = cover.path.replace(/\\/g, "/");
      }

      await book.save();
      res.redirect('/master/buku');
   } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   }
};

exports.show = async (req, res, next) => {
   const bookId = req.params.bookId;

   try {
      const book = await Book.findByPk(bookId, { id: bookId });

      if(!book) {
         return res.redirect('/master/buku');
      }

      res.render('main', {
         pageTitle: 'Detail Buku',
         path: '/master',
         view: 'pages/master/detail-book.ejs',
         book: book
      });
   } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   }
};

exports.destroy = async (req, res, next) => {
   const bookId = req.body.bookId;

   try {
      const book = await Book.findByPk(bookId);
      fileHelper.deleteFile(book.cover);
      await book.destroy();
      req.flash('type', 'success');
      req.flash('message', 'Buku berhasil dihapus');
      res.redirect('/master/buku');
   } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
   }
};