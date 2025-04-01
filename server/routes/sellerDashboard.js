const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { createNotification } = require('./notifications');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get or create seller's shop
router.get('/shop', authMiddleware, (req, res) => {
  db.get('SELECT * FROM shops WHERE owner_id = ?', [req.user.id], (err, shop) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!shop) {
      // Create a new shop for the seller
      const defaultShopName = `${req.user.username}'s Shop`;
      db.run('INSERT INTO shops (owner_id, name, description) VALUES (?, ?, ?)', 
        [req.user.id, defaultShopName, 'Welcome to my shop!'],
        function(err) {
          if (err) {
            console.error('Error creating shop:', err);
            return res.status(500).json({ error: 'Error creating shop' });
          }
          // Fetch the newly created shop
          db.get('SELECT * FROM shops WHERE id = ?', [this.lastID], (err, newShop) => {
            if (err) {
              console.error('Error fetching new shop:', err);
              return res.status(500).json({ error: 'Error fetching new shop' });
            }
            res.json(newShop);
          });
        }
      );
    } else {
      res.json(shop);
    }
  });
});

// Update seller's shop
router.put('/shop', authMiddleware, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]), (req, res) => {
  const { name, description } = req.body;
  const logo = req.files['logo'] ? req.files['logo'][0].filename : null;
  const coverPhoto = req.files['coverPhoto'] ? req.files['coverPhoto'][0].filename : null;

  let updateQuery = 'UPDATE shops SET name = ?, description = ?';
  let updateParams = [name, description];

  if (logo) {
    updateQuery += ', logo_url = ?';
    updateParams.push(logo);
  }

  if (coverPhoto) {
    updateQuery += ', cover_photo_url = ?';
    updateParams.push(coverPhoto);
  }

  updateQuery += ' WHERE owner_id = ?';
  updateParams.push(req.user.id);

  db.run(updateQuery, updateParams, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error updating shop' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json({ message: 'Shop updated successfully' });
  });
});

// Get seller's products
router.get('/products', authMiddleware, (req, res) => {
  db.all(`
    SELECT p.*, pi.image_url 
    FROM products p 
    LEFT JOIN product_images pi ON p.id = pi.product_id 
    WHERE p.shop_id IN (SELECT id FROM shops WHERE owner_id = ?)
  `, [req.user.id], (err, products) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ products: products || [] });
  });
});


// Add a new product
router.post('/products', authMiddleware, upload.array('images', 5), (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const images = req.files;

  db.get('SELECT id FROM shops WHERE owner_id = ?', [req.user.id], (err, shop) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!shop) {
      return res.status(400).json({ error: 'Seller does not have a shop' });
    }

    db.run('INSERT INTO products (shop_id, name, description, price, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [shop.id, name, description, price, category, stock],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Error adding product' });
        }

        const productId = this.lastID;

        if (images && images.length > 0) {
          const imageInserts = images.map(image => {
            return new Promise((resolve, reject) => {
              db.run('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
                [productId, image.filename],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
          });

          Promise.all(imageInserts)
            .then(() => {
              res.status(201).json({ message: 'Product added successfully', productId: productId });
            })
            .catch((err) => {
              console.error('Error adding product images:', err);
              res.status(500).json({ error: 'Error adding product images' });
            });
        } else {
          res.status(201).json({ message: 'Product added successfully', productId: productId });
        }
      }
    );
  });
});

// Update a product
router.put('/products/:id', authMiddleware, upload.single('image'), (req, res) => {
  console.log('Updating product:', req.params.id);
  console.log('Request body:', req.body);
  console.log('File:', req.file);

  const { name, description, price, category, stock } = req.body;
  const image = req.file ? req.file.filename : null;

  let updateQuery = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ? WHERE id = ?';
  let updateParams = [name, description, price, category, stock, req.params.id];


  db.get('SELECT shop_id FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.get('SELECT id FROM shops WHERE owner_id = ?', [req.user.id], (err, shop) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!shop || shop.id !== product.shop_id) {
        return res.status(403).json({ error: 'You do not have permission to update this product' });
      }

      db.run(updateQuery, updateParams, function(err) {
        if (err) {
          console.error('Error updating product:', err);
          return res.status(500).json({ error: 'Error updating product' });
        }

        if (image) {
          db.run('UPDATE product_images SET image_url = ? WHERE product_id = ?', 
            [image, req.params.id], (err) => {
            if (err) {
              console.error('Error updating product image:', err);
              return res.status(500).json({ error: 'Error updating product image' });
            }
            res.json({ message: 'Product and image updated successfully' });
          });
        } else {
          res.json({ message: 'Product updated successfully' });
        }
      });
    });
  });
});


// Delete a product
router.delete('/products/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM products WHERE id = ? AND shop_id IN (SELECT id FROM shops WHERE owner_id = ?)',
    [req.params.id, req.user.id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error deleting product' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found or you do not have permission to delete it' });
      }
      
      // Delete associated images
      db.run('DELETE FROM product_images WHERE product_id = ?', [req.params.id], (err) => {
        if (err) {
          console.error('Error deleting product images:', err);
          // We don't return here as the product was successfully deleted
        }
      });
      
      res.json({ message: 'Product deleted successfully' });
    }
  );
});

// Get seller's orders
router.get('/orders', authMiddleware, (req, res) => {
  const query = `
    SELECT DISTINCT o.*, 
           json_group_array(json_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'product_name', p.name)) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    JOIN shops s ON p.shop_id = s.id
    WHERE s.owner_id = ?
    GROUP BY o.id
  `;

  db.all(query, [req.user.id], (err, orders) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Parse the JSON string of items for each order
    orders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    console.log('Fetched orders for seller:', orders);
    res.json({ orders });
  });
});


// Update order status
router.put('/orders/:orderId/status', authMiddleware, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  console.log(`Attempting to update order ${orderId} to status: ${status} for user ${req.user.id}`);

  // First, check if the order exists
  db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
    if (err) {
      console.error('Database error when checking order existence:', err);
      return res.status(500).json({ error: 'Error checking order existence' });
    }

    if (!order) {
      console.log(`Order ${orderId} not found in the database.`);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('Order found in database:', order);

    // Now check if the seller has permission to update this order
    db.get(`
      SELECT DISTINCT o.id, s.owner_id, o.buyer_id
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN shops s ON p.shop_id = s.id
      WHERE o.id = ? AND s.owner_id = ?
    `, [orderId, req.user.id], (err, sellerOrder) => {
      if (err) {
        console.error('Database error when checking seller permission:', err);
        return res.status(500).json({ error: 'Error checking order permissions' });
      }

      if (!sellerOrder) {
        console.log(`User ${req.user.id} does not have permission to update order ${orderId}.`);
        return res.status(403).json({ error: 'You do not have permission to update this order' });
      }

      // If we reach here, the seller has permission to update the order
      db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], function(err) {
        if (err) {
          console.error('Database error when updating order status:', err);
          return res.status(500).json({ error: 'Error updating order status' });
        }
        console.log(`Successfully updated order ${orderId} to status: ${status}`);

        // Create a notification for the buyer
        createNotification(
          sellerOrder.buyer_id,
          'Order Status Update',
          `Your order #${orderId} status has been updated to ${status}.`
        ).catch(err => console.error('Error creating notification:', err));

        res.json({ message: 'Order status updated successfully' });
      });
    });
  });
});


module.exports = router;