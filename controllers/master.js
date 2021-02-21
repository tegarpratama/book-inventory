const { validationResult } = require('express-validator');

const Book = require('../models/book');
const fileHelper = require('../config/file.js');

exports.index = async (req, res, next) => {
   const books = await Book.findAll();
   
   res.render('main', {
      pageTitle: 'Books',
      path: '/master',
      view: 'master/books.ejs',
      books: books,
   });
};

exports.create = (req, res, next) => {
   res.render('main', {
      pageTitle: 'Add Book',
      path: '/master',
      view: 'master/edit-book.ejs',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: []
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
   const cover = req.file;
   
   if(!errors.isEmpty()) {
      return res.status(422).render('main', {
         pageTitle: 'Add Book',
         path: '/master',
         view: 'master/edit-book.ejs',
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
         errorMessage: errors.array()[0].msg,
         validationErrors: errors.array()
      });
   }

   const book = new Book({
      title: title,
      author: author,
      publisher: publisher,
      totalPages: totalPages,
      price: price,
      stock: stock,
      description: description,
      cover: cover.path.replace(/\\/g, "/"),
      userId: req.user.id
   });
   
   book.save()
      .then(() => {
         res.redirect('/master/books');
      })
      .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
      });
};

exports.edit = async (req, res, next) => {
   const bookId = req.params.bookId;
   const book = await Book.findByPk(bookId, { userId: req.user.id })

   if(!book) {
      return res.redirect('/master/books');
   }

   res.render('main', {
      pageTitle: 'Edit Book',
      path: '/master',
      view: 'master/edit-book.ejs',
      editing: true,
      book: book,
      hasError: false,
      errorMessage: null,
      validationErrors: []
   });
};

exports.update = async (req, res, next) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()) {
      return res.status(422).render('main', {
         pageTitle: 'Edit Book',
         path: '/master',
         view: 'master/edit-book.ejs',
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
         errorMessage: errors.array()[0].msg,
         validationErrors: errors.array()
      });
   }

   const bookId = req.body.bookId;
   const title = req.body.title;
   const author = req.body.author;
   const publisher = req.body.publisher;
   const totalPages = req.body.totalPages;
   const price = req.body.price;
   const stock = req.body.stock;
   const description = req.body.description;
   const cover = req.file;

   Book.findByPk(bookId)
      .then(book => {
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

         return book.save();
      })
      .then(() => {
         res.redirect('/master/books');
      })
      .catch(err => {
         console.log(err);
      });   
};

exports.show = async (req, res, next) => {
   const bookId = req.params.bookId;
   const book = await Book.findByPk(bookId, { id: bookId });

   if(!book) {
      return res.redirect('/books');
   }

   res.render('main', {
      pageTitle: 'Edit Book',
      path: '/master',
      view: 'master/detail-book.ejs',
      book: book
   });
};

exports.destroy = async (req, res, next) => {
   const bookId = req.body.bookId;
   const book = await Book.findByPk(bookId);

   fileHelper.deleteFile(book.cover);
   await book.destroy();

   res.redirect('/master/books');
};