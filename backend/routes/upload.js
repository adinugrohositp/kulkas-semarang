const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageService = require('../storageService');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Upload file endpoint
router.post('/file', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const s3Url = await storageService.uploadFile(req.file.buffer, req.file.mimetype);
        res.json({ url: s3Url });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Upload from URL endpoint
router.post('/url', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const s3Url = await storageService.downloadAndUploadFile(url);
        res.json({ url: s3Url });
    } catch (error) {
        console.error('Error uploading from URL:', error);
        res.status(500).json({ error: 'Failed to upload from URL' });
    }
});

module.exports = router;
