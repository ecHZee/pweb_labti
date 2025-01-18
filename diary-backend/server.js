const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5100;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Replace with your MySQL password
  database: "diary_app", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Routes

// Get all entries
app.get("/api/entries", (req, res) => {
  const query = "SELECT * FROM entries";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch entries." });
    }
    res.json(results);
  });
});

// Get a single entry by ID
app.get("/api/entries/:id", (req, res) => {
  const query = "SELECT * FROM entries WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch entry." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Entry not found." });
    }
    res.json(results[0]);
  });
});

// Add a new entry
app.post("/api/entries", (req, res) => {
  const { title, content, date } = req.body;
  const query = "INSERT INTO entries (title, content, date) VALUES (?, ?, ?)";
  db.query(query, [title, content, date], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to add entry." });
    }
    res.status(201).json({ id: result.insertId, title, content, date });
  });
});

// Update an entry
app.put("/api/entries/:id", (req, res) => {
  const { title, content, date } = req.body;
  const query = "UPDATE entries SET title = ?, content = ?, date = ? WHERE id = ?";
  db.query(query, [title, content, date, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update entry." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found." });
    }
    res.json({ id: req.params.id, title, content, date });
  });
});

// Delete an entry
app.delete("/api/entries/:id", (req, res) => {
  const query = "DELETE FROM entries WHERE id = ?";
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete entry." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found." });
    }
    res.json({ message: "Entry deleted successfully." });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
