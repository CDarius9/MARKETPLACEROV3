const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Add product to wishlist
router.post('/', authMiddleware, (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  db.run('INSERT OR IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)',
    [userId, productId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error adding to wishlist' });
      }
      res.status(201).json({ message: 'Product added to wishlist', wishlistId: this.lastID });
    }
  );
});

// Remove product from wishlist
router.delete('/:productId', authMiddleware, (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  db.run('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
    [userId, productId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error removing from wishlist' });
      }
      res.json({ message: 'Product removed from wishlist' });
    }
  );
});

// Get user's wishlist
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  db.all(`
    SELECT p.*, w.created_at as added_to_wishlist, pi.image_url
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `,
    [userId],
    (err, products) => {
      if (err) {
        console.error('Error fetching wishlist:', err);
        return res.status(500).json({ error: 'Error fetching wishlist' });
      }
      console.log('Fetched wishlist items:', products);
      res.json(products);
    }
  );
});

module.exports = router;