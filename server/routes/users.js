const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/profile', authMiddleware, (req, res) => {
  db.get('SELECT id, username, email, user_type FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      user_type: user.user_type
    });
  });
});

// Update user profile
router.put('/profile', authMiddleware, (req, res) => {
  const { username, email } = req.body;

  db.run('UPDATE users SET username = ?, email = ? WHERE id = ?', 
    [username, email, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating profile' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;