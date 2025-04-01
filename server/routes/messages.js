// routes/messages.js

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get conversations for a user
router.get('/conversations', authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT 
      CASE 
        WHEN m.sender_id = ? THEN m.receiver_id
        ELSE m.sender_id
      END as other_user_id,
      u.username as other_username,
      m.content as last_message,
      m.created_at as last_message_time,
      COUNT(CASE WHEN m.is_read = 0 AND m.receiver_id = ? THEN 1 END) as unread_count
    FROM messages m
    JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
    WHERE m.sender_id = ? OR m.receiver_id = ?
    GROUP BY other_user_id
    ORDER BY m.created_at DESC`,
    [userId, userId, userId, userId, userId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching conversations:', err);
        return res.status(500).json({ error: 'Error fetching conversations' });
      }
      res.json(rows);
    }
  );
});

// Get messages for a specific conversation
router.get('/:otherUserId', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const otherUserId = req.params.otherUserId;

  db.all(
    `SELECT m.*, u.username as sender_username
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at ASC`,
    [userId, otherUserId, otherUserId, userId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ error: 'Error fetching messages' });
      }
      
      // Mark messages as read
      db.run(
        'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
        [otherUserId, userId],
        (err) => {
          if (err) {
            console.error('Error marking messages as read:', err);
          }
        }
      );

      res.json(rows);
    }
  );
});

// Send a message
router.post('/', authMiddleware, (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  db.run(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [senderId, receiverId, content],
    function (err) {
      if (err) {
        console.error('Error sending message:', err);
        return res.status(500).json({ error: 'Error sending message' });
      }
      res.status(201).json({ message: 'Message sent successfully', messageId: this.lastID });
    }
  );
});

module.exports = router;