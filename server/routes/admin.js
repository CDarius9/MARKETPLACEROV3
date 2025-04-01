const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  console.log('Checking if user is admin:', req.user);
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Apply authMiddleware and isAdmin to all routes
router.use(authMiddleware);
router.use(isAdmin);

// Add a new category
router.post('/categories', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO categories (name) VALUES (?)', [name], function(err) {
    if (err) {
      console.error('Error adding category:', err);
      return res.status(500).json({ error: 'Error adding category' });
    }
    res.status(201).json({ id: this.lastID, name });
  });
});

// Get all categories
router.get('/categories', authMiddleware, (req, res) => {
  db.all('SELECT * FROM categories', (err, categories) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories);
  });
});

// Update a category
router.put('/categories/:id', authMiddleware, isAdmin, (req, res) => {
  const { name } = req.body;
  db.run('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error updating category' });
    }
    res.json({ message: 'Category updated successfully' });
  });
});

// Delete a category
router.delete('/categories/:id', authMiddleware, isAdmin, (req, res) => {
  db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting category' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

module.exports = router;