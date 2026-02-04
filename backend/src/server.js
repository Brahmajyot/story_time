const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Story Generator API is running' });
});

// Temporary middleware to simulate Clerk auth (for testing)
app.use((req, res, next) => {
    // Use admin email from env for testing, fallback to test email
    const testEmail = process.env.ADMIN_EMAIL || 'test@example.com';

    req.auth = {
        userId: 'test_user_123',
        sessionClaims: {
            email: testEmail
        }
    };
    console.log(`🔓 Auth simulated for: ${testEmail}`);
    next();
});

// Protected routes (Clerk auth temporarily disabled for testing)
app.use('/api/stories', require('./routes/stories'));

// Admin routes (protected by admin middleware)
app.use('/api/admin', require('./routes/admin'));

// Webhook routes
app.use('/api/webhooks', require('./routes/webhooks'));
app.use('/api/payment/webhook', require('./routes/payment'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Connect to MongoDB
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully!');

        // Start server after DB connection
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
            console.log(`⚠️  WARNING: Clerk authentication is DISABLED for testing`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

module.exports = app;
