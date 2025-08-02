const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get all books
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get books by author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const bookList = Object.values(books);
  const filteredBooks = bookList.filter((book) => book.author === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get books by title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const bookList = Object.values(books);
  const filteredBooks = bookList.filter((book) => book.title === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get reviews by ISBN
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

const getAllBooks = async () => {
  try {
    const response = await axios.get("http://localhost:5000/");
    console.log("All Books:", response.data);
  } catch (error) {
    console.error("Error fetching all books:", error.message);
  }
};

const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("Book Details:", response.data);
  } catch (error) {
    console.error("Error fetching book by ISBN:", error.message);
  }
};

const getBookByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Book Author:`, response.data);
  } catch (error) {
    console.error("Error fetching book author data:", error.message);
  }
};

const getBookByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Book Title:`, response.data);
  } catch (error) {
    console.error("Error fetching book title data:", error.message);
  }
};

getBookByTitle("Pride and Prejudice");

module.exports.general = public_users;
