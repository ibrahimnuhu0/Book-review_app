const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully." });
});


public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});


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


public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews || {});
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});


public_users.get('/async-books', async (req, res) => {
  try {
    const bookList = await new Promise((resolve) => resolve(books));
    return res.status(200).send(JSON.stringify(bookList, null, 2));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


public_users.get('/async-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const bookData = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });

    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


public_users.get('/async-author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();

  try {
    const matchingBooks = await new Promise((resolve) => {
      const results = [];

      for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
          results.push({ isbn, ...books[isbn] });
        }
      }

      resolve(results);
    });

    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "No books found by this author." });
    }

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});


public_users.get('/async-title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();

  try {
    const matchingBooks = await new Promise((resolve) => {
      const results = [];

      for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
          results.push({ isbn, ...books[isbn] });
        }
      }

      resolve(results);
    });

    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "No books found with this title." });
    }

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports.general = public_users;
