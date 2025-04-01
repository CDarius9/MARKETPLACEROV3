
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all categories (no authentication required)
router.get('/', (req, res) => {
  db.all('SELECT * FROM categories', (err, categories) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories);
  });
});

module.exports = router;