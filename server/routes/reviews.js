// In routes/reviews.js

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Add a new review
router.post('/', authMiddleware, (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  db.run('INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, productId, rating, comment],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error adding review' });
      }
      res.status(201).json({ message: 'Review added successfully', reviewId: this.lastID });
    }
  );
});

// Edit a review
router.put('/:id', authMiddleware, (req, res) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.id;
  const userId = req.user.id;

  db.run('UPDATE reviews SET rating = ?, comment = ?, edited = 1 WHERE id = ? AND user_id = ?',
    [rating, comment, reviewId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating review' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Review not found or you do not have permission to edit it' });
      }
      res.json({ message: 'Review updated successfully' });
    }
  );
});

// Get reviews for a product
router.get('/product/:productId', (req, res) => {
  const { productId } = req.params;
  db.all(`
    SELECT reviews.*, users.username 
    FROM reviews 
    JOIN users ON reviews.user_id = users.id 
    WHERE product_id = ?
    ORDER BY reviews.created_at DESC
  `,
    [productId],
    (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(reviews);
    }
  );
});

router.get('/user', authMiddleware, (req, res) => {
  console.log('Fetching reviews for user:', req.user.id);
  db.all(`
    SELECT reviews.*, 
           products.name as product_name, 
           product_images.image_url as product_image
    FROM reviews
    JOIN products ON reviews.product_id = products.id
    LEFT JOIN product_images ON products.id = product_images.product_id
    WHERE reviews.user_id = ?
    ORDER BY reviews.created_at DESC
  `,
    [req.user.id],
    (err, reviews) => {
      if (err) {
        console.error('Database error when fetching user reviews:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      console.log('Fetched reviews:', reviews);
      res.json(reviews);
    }
  );
});


module.exports = router;