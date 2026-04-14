const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, 'data', 'uploads');

// Helper to get local proxy URL
const getProxyUrl = (key) => {
    // Return with /api prefix so Nginx correctly routes to backend
    return `/api/image/${key}`;
};

/**
 * Upload buffer to local disk
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File mimetype
 * @returns {Promise<string>} - Proxy URL
 */
async function uploadFile(buffer, mimetype) {
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const extension = mimetype.split('/')[1] || 'jpeg';
    const prefix = process.env.S3_PREFIX || 'products';
    const key = `${prefix}/${filename}.${extension}`;
    
    const targetDir = path.join(UPLOADS_DIR, prefix);
    
    // Ensure directory exists
    await fs.promises.mkdir(targetDir, { recursive: true });
    
    const targetPath = path.join(UPLOADS_DIR, key);
    await fs.promises.writeFile(targetPath, buffer);

    return getProxyUrl(key);
}

/**
 * Get file stream from local disk
 * @param {string} key - File key
 * @returns {Promise<{body: Stream, contentType: string}>}
 */
async function getFileStream(key) {
    const filePath = path.join(UPLOADS_DIR, key);
    
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
    } catch (err) {
        const error = new Error('NoSuchKey');
        error.name = 'NoSuchKey';
        throw error;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    
    // Simple mime type detection based on extension
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    return {
        body: fs.createReadStream(filePath),
        contentType
    };
}

/**
 * Download image from URL and upload to local disk
 * @param {string} imageUrl - Source image URL
 * @returns {Promise<string>} - Proxy URL
 */
async function downloadAndUploadFile(imageUrl) {
    const axios = require('axios'); // Require here just like before

    const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000
    });

    const buffer = Buffer.from(response.data);
    const mimetype = response.headers['content-type'] || 'image/jpeg';

    return uploadFile(buffer, mimetype);
}

module.exports = {
    uploadFile,
    getFileStream,
    downloadAndUploadFile
};
