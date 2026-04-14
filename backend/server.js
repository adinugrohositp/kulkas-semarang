const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS for internal network
app.use(cors({
    origin: '*', // Allow all origins for internal network
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Support base64 images

// Routes
const productsRouter = require('./routes/products');
const uploadRouter = require('./routes/upload');
const settingsRouter = require('./routes/settings');
const imageRouter = require('./routes/image');
const authRouter = require('./routes/auth');
const checkoutRouter = require('./routes/checkout');

app.use('/api/products', productsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/image', imageRouter);
app.use('/api/auth', authRouter);
app.use('/api/checkout', checkoutRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kulkas Kejujuran API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 API available at http://localhost:${PORT}/api/products`);
});
