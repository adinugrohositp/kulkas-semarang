const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all settings
router.get('/', (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM settings').all();
        const settingsMap = {};
        settings.forEach(s => {
            let val = s.value;
            // Process S3 URLs to use proxy
            if (s.key === 'qris_url' && val && val.startsWith('http') && (val.includes('hcp1-djpb.kemenkeu.go.id') || val.includes('hitachi'))) {
                const parts = val.split('/products/');
                if (parts.length > 1) {
                    val = `/api/image/products/${parts[1]}`;
                }
            }
            settingsMap[s.key] = val;
        });
        res.json(settingsMap);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// GET single setting
router.get('/:key', (req, res) => {
    try {
        const { key } = req.params;
        const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
        let val = setting ? setting.value : null;

        if (key === 'qris_url' && val && val.startsWith('http') && (val.includes('hcp1-djpb.kemenkeu.go.id') || val.includes('hitachi'))) {
            const parts = val.split('/products/');
            if (parts.length > 1) {
                val = `/api/image/products/${parts[1]}`;
            }
        }

        res.json({ key, value: val });
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
});

// PUT update or create setting
router.put('/:key', (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        if (value === undefined) {
            return res.status(400).json({ error: 'Value is required' });
        }

        const upsert = db.prepare(`
            INSERT INTO settings (key, value) 
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);
        upsert.run(key, value);

        res.json({ message: 'Setting updated successfully', key, value });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

module.exports = router;
