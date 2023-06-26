// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

let bookController = require('../controllers/book')

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  try {
    res.render('book/add', {
        title: 'Add a Book', 
        displayName: req.user ? req.user.displayName : ''})
} catch (err) {
    console.error(err);
}

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  let newBook = new Book({
    "Title": req.body.title,
    "Description": req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
});

try{
    res.redirect('/book-list');
} catch (err) {
    console.log(err);
    res.status(500).send(err);
}

});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', (req, res, next) => {
  let id = req.params.id;

  try {
      let bookToEdit = Book.findById(id);
      res.render('book/edit', {
          title: 'Edit Book', 
          book: bookToEdit, 
          displayName: req.user ? req.user.displayName : ''});
  } catch (err) {
      console.log(err);
      res.status(500).send(err);
  }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  let updatedBook = {
    "Title": req.body.title,
    "Description": req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  };

  try {
    Book.updateOne({_id: id}, updatedBook);
      res.redirect('/game-list');
  } catch (err) {
      console.log(err);
      res.status(500).send(err);
  }

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  try {
    Book.findByIdAndRemove(id);
      res.redirect('/book-list');
  } catch (err) {
      console.log(err);
      res.status(500).send(err);
  }
});

module.exports = router
