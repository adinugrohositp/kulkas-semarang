const express = require('express');
const router = express.Router();
const storageService = require('../storageService');

// Proxy image from local storage
// Expected path: /api/image/products/filename.ext
router.get('/*', async (req, res) => {
    try {
        const key = req.params[0]; // Get the full path after /image/
        if (!key) {
            return res.status(400).send('Missing image key');
        }

        console.log(`Proxying image: ${key}`);
        const { body, contentType } = await storageService.getFileStream(key);

        console.log(`Local file response received for ${key}. Content-Type: ${contentType}`);

        if (!contentType) {
            res.setHeader('Content-Type', 'image/jpeg'); // Default fallback
        } else {
            res.setHeader('Content-Type', contentType);
        }

        res.setHeader('Cache-Control', 'public, max-age=31536000');

        // Stream the S3 body to the response
        body.on('error', (err) => {
            console.error(`Stream error for ${key}:`, err);
            if (!res.headersSent) {
                res.status(500).send('Error streaming image');
            }
        });

        body.on('end', () => {
            console.log(`Stream ended for ${key}`);
        });

        body.pipe(res);
    } catch (error) {
        console.error(`Error proxying image ${req.params[0]}:`, error);
        if (error.name === 'NoSuchKey') {
            res.status(404).send('Image not found');
        } else {
            res.status(500).send(`Error fetching image: ${error.message}`);
        }
    }
});

module.exports = router;
