const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get user's notifications
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, notifications) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      return res.status(500).json({ error: 'Error fetching notifications' });
    }
    res.json(notifications);
  });
});

// Mark notification as read
router.put('/:id/read', authMiddleware, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId], function(err) {
    if (err) {
      console.error('Error marking notification as read:', err);
      return res.status(500).json({ error: 'Error marking notification as read' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }
    res.json({ message: 'Notification marked as read' });
  });
});

// Create a new notification (this will be called from other parts of the application)
const createNotification = (userId, type, message) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
      [userId, type, message],
      function(err) {
        if (err) {
          console.error('Error creating notification:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

// Get unread notifications count
router.get('/unread-count', authMiddleware, (req, res) => {
    const userId = req.user.id;
    db.get('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [userId], (err, row) => {
      if (err) {
        console.error('Error fetching unread notifications count:', err);
        return res.status(500).json({ error: 'Error fetching unread notifications count' });
      }
      res.json({ count: row.count });
    });
  });
  
  // Mark all notifications as read
  router.put('/mark-all-read', authMiddleware, (req, res) => {
    const userId = req.user.id;
    db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId], function(err) {
      if (err) {
        console.error('Error marking all notifications as read:', err);
        return res.status(500).json({ error: 'Error marking all notifications as read' });
      }
      res.json({ message: 'All notifications marked as read' });
    });
  });

module.exports = router;
module.exports.createNotification = createNotification;