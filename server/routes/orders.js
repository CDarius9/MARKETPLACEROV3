const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { createNotification } = require('./notifications');


// Create a new order
router.post('/', authMiddleware, (req, res) => {
  const { totalAmount, items, shippingAddress } = req.body;
  db.run('BEGIN TRANSACTION');
  db.run(`INSERT INTO orders (buyer_id, total_amount, status, full_name, address, city, zip_code, country) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, totalAmount, 'pending', shippingAddress.fullName, shippingAddress.address, 
     shippingAddress.city, shippingAddress.zipCode, shippingAddress.country],
    function (err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Error creating order' });
      }
      const orderId = this.lastID;
      
      const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
      const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      
      for (const item of items) {
        updateStock.run([item.quantity, item.productId, item.quantity], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Error updating product stock' });
          }
        });

        insertItem.run([orderId, item.productId, item.quantity, item.price], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Error creating order items' });
          }
        });
      }

      updateStock.finalize();
      insertItem.finalize();

      db.run('COMMIT', async (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Error committing transaction' });
        }
        
        // Create a notification for the order
        try {
          await createNotification(req.user.id, 'Order Created', `Your order #${orderId} has been placed successfully.`);
        } catch (notifErr) {
          console.error('Error creating notification:', notifErr);
          // We don't return here as the order was successfully created
        }

        res.status(201).json({ message: 'Order created successfully', orderId: orderId });
      });
    }
  );
});

// Get all orders for a user (updated to include items)
router.get('/', authMiddleware, (req, res) => {
  db.all(`
    SELECT orders.*, 
           GROUP_CONCAT(order_items.product_id || ':' || order_items.quantity || ':' || order_items.price) AS items
    FROM orders
    LEFT JOIN order_items ON orders.id = order_items.order_id
    WHERE orders.buyer_id = ?
    GROUP BY orders.id
    ORDER BY orders.created_at DESC
  `, [req.user.id], (err, orders) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(orders);
  });
});

// Get a specific order
router.get('/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ? AND buyer_id = ?', [req.params.id, req.user.id], (err, order) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Get order items with product details including images
    db.all(`
      SELECT oi.*, p.name as product_name, p.description, pi.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE oi.order_id = ?
    `, [req.params.id], (err, items) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      order.items = items;
      console.log('Order details:', order); // Add this line for debugging
      res.json(order);
    });
  });
});

// Cancel an order
router.post('/:id/cancel', authMiddleware, (req, res) => {
  const orderId = req.params.id;
  db.run('UPDATE orders SET status = "cancelled" WHERE id = ? AND buyer_id = ? AND status = "pending"', 
    [orderId, req.user.id], 
    async function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
      }
      
      // Create a notification for the order cancellation
      try {
        await createNotification(req.user.id, 'Order Cancelled', `Your order #${orderId} has been cancelled.`);
      } catch (notifErr) {
        console.error('Error creating notification:', notifErr);
        // We don't return here as the order was successfully cancelled
      }

      res.json({ message: 'Order cancelled successfully' });
    }
  );
});

// Request a return
router.post('/:id/return', authMiddleware, (req, res) => {
  const orderId = req.params.id;
  db.run('UPDATE orders SET status = "return_requested" WHERE id = ? AND buyer_id = ? AND status = "delivered"', 
    [orderId, req.user.id], 
    async function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found or cannot be returned' });
      }
      
      // Create a notification for the return request
      try {
        await createNotification(req.user.id, 'Return Requested', `A return has been requested for your order #${orderId}.`);
      } catch (notifErr) {
        console.error('Error creating notification:', notifErr);
        // We don't return here as the return request was successfully processed
      }

      res.json({ message: 'Return requested successfully' });
    }
  );
});

module.exports = router;