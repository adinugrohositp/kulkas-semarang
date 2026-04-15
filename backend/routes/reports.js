const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/reports?period=weekly|monthly
router.get('/', (req, res) => {
    try {
        const { period } = req.query;
        let query = 'SELECT * FROM transactions';
        let params = [];
        
        if (period === 'weekly') {
            query += " WHERE created_at >= date('now', '-7 days')";
        } else if (period === 'monthly') {
            query += " WHERE created_at >= date('now', '-30 days')";
        }
        
        query += " ORDER BY created_at DESC";
        
        const transactions = db.prepare(query).all(...params);
        res.json(transactions);
    } catch (error) {
        console.error('Reports error:', error);
        res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
    }
});

module.exports = router;
