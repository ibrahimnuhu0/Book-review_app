const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

   kmbg
  return res.status(200).json({ message: "User registered successfully." });
});

// Get the list of all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const matchingBooks = [];

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found by this author." });
  }

  return res.status(200).json(matchingBooks);
});

// Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const matchingBooks = [];

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found with this title." });
  }

  return res.status(200).json(matchingBooks);
});

// Get reviews of a book by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews || {});
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;
