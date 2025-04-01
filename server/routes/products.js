const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Create a new product
router.post('/', authMiddleware, (req, res) => {
  const { shopId, name, description, price, category } = req.body;

  db.run('INSERT INTO products (shop_id, name, description, price, category) VALUES (?, ?, ?, ?, ?)',
    [shopId, name, description, price, category],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating product' });
      }
      res.status(201).json({ message: 'Product created successfully', productId: this.lastID });
    }
  );
});



// Get all products with optional filtering and pagination
router.get('/', (req, res) => {
  const { page, limit, category, shopId } = req.query;
  
  let query = `
    SELECT p.*, pi.image_url 
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
  `;
  let countQuery = 'SELECT COUNT(*) as total FROM products p';
  let params = [];
  let countParams = [];

  if (category || shopId) {
    query += ' WHERE';
    countQuery += ' WHERE';
  }

  if (category) {
    query += ' p.category = ?';
    countQuery += ' p.category = ?';
    params.push(category);
    countParams.push(category);
  }

  if (shopId) {
    if (category) {
      query += ' AND';
      countQuery += ' AND';
    }
    query += ' p.shop_id = ?';
    countQuery += ' p.shop_id = ?';
    params.push(shopId);
    countParams.push(shopId);
  }

  // Apply pagination only if both page and limit are provided
  if (page && limit) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
  }

  db.all(query, params, (err, products) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (page && limit) {
      // If pagination is requested, also get the total count
      db.get(countQuery, countParams, (countErr, row) => {
        if (countErr) {
          console.error('Database error:', countErr);
          return res.status(500).json({ error: 'Database error' });
        }
        
        const total = row.total;
        res.json({
          products,
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total
        });
      });
    } else {
      // If no pagination, just return all products
      res.json({ products });
    }
  });
});


// Get all products with optional category filtering
router.get('/', (req, res) => {
  const { category } = req.query;
  
  let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
  let params = [];

  if (category) {
    query += ' WHERE p.category_id = ?';
    params.push(category);
  }

  db.all(query, params, (err, products) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ products });
  });
});


// Get a specific product
router.get('/:id', (req, res) => {
  const query = `
    SELECT p.*, pi.image_url 
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.id = ?
  `;
  
  db.get(query, [req.params.id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });
});

module.exports = router;