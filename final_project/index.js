const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Session setup
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// JWT Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    const token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
});

// Public routes (GET books, register)
app.use("/", genl_routes);

// Protected routes (login, add reviews, etc.)
app.use("/customer", customer_routes);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
