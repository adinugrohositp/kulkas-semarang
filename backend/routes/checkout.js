const express = require('express');
const router = express.Router();
const db = require('../db');

// POST checkout
router.post('/', (req, res) => {
    try {
        const { cart } = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ error: 'Cart is empty or invalid' });
        }

        let totalAmount = 0;

        const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        const getSales = db.prepare('SELECT value FROM settings WHERE key = ?');
        const upsertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
        const insertTx = db.prepare('INSERT INTO transactions (product_id, product_name, category, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)');

        // Use transaction to ensure data integrity
        db.transaction(() => {
            for (const item of cart) {
                const totalItemAmount = item.price * item.quantity;
                totalAmount += totalItemAmount;
                updateStock.run(item.quantity, item.id);
                insertTx.run(item.id, item.name, item.category, item.quantity, item.price, totalItemAmount);
            }
            
            // Re-fetch total sales inside transaction and update it
            const salesRecord = getSales.get('total_sales');
            const currentSales = salesRecord && salesRecord.value ? parseInt(salesRecord.value, 10) : 0;
            const newSales = currentSales + totalAmount;
            
            upsertSetting.run('total_sales', newSales.toString());
        })();

        res.json({ success: true, totalAmount });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Checkout failed', details: error.message });
    }
});

module.exports = router;
