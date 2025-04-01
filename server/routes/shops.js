const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Create a new shop
router.post('/', authMiddleware, (req, res) => {
  const { name, description } = req.body;

  db.run('INSERT INTO shops (owner_id, name, description) VALUES (?, ?, ?)',
    [req.user.id, name, description],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating shop' });
      }
      res.status(201).json({ message: 'Shop created successfully', shopId: this.lastID });
    }
  );
});

// Get all shops
router.get('/', (req, res) => {
  db.all('SELECT * FROM shops', (err, shops) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ shops: shops || [] });
  });
});

// Get a specific shop
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM shops WHERE id = ?', [req.params.id], (err, shop) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json(shop);
  });
});

// Update a shop
router.put('/:id', authMiddleware, (req, res) => {
  const { name, description } = req.body;

  db.run('UPDATE shops SET name = ?, description = ? WHERE id = ? AND owner_id = ?',
    [name, description, req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating shop' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Shop not found or you do not have permission' });
      }
      res.json({ message: 'Shop updated successfully' });
    }
  );
});

module.exports = router;