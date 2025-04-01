const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

router.post('/register', async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if it's an admin registration
      if (userType === 'admin') {
        // You should use a more secure method in production, like a separate admin registration endpoint
        // This is just for testing purposes
        const adminSecretKey = req.body.adminSecretKey;
        if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
          return res.status(403).json({ error: 'Invalid admin secret key' });
        }
      }

      // Insert new user
      db.run('INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, userType],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }
          
          const userId = this.lastID;

          // Create and send token
          const payload = {
            user: {
              id: userId,
              userType: userType
            }
          };

          jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ message: 'User registered successfully', token });
          });
        }
      );
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        userType: user.user_type
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  });
});

module.exports = router;