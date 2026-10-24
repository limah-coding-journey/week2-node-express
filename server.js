
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

require ("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON request bodies
app.use(express.json());

// Bonus: custom middleware to log incoming requests
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url}`
  );
  next();
});

// Serve the static HTML page first
app.use(express.static("public"));

// GET/
app.get("/", (req, res) => {
  res.send("My Week 2 API");});

// POST /user - accept name and email
app.post("/user", (req, res) => {
  const { name, email } = req.body || {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required.",
    });
  }

  res.status(200).json({
    message: `Hello, ${name.trim()}!`,
    email: email.trim(),
  });
});

// GET /user/:id - user profile
app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: `User ${id} profile`,
    id: id,
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
  console.error(err.message);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format.",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
