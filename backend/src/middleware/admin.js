// Admin authentication middleware
// Only allows access to users with email matching ADMIN_EMAIL in .env

const adminAuth = (req, res, next) => {
    try {
        const userEmail = req.auth?.sessionClaims?.email;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            console.error('❌ ADMIN_EMAIL not set in environment variables');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        if (!userEmail) {
            console.warn('⚠️  Admin access attempt with no email');
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (userEmail !== adminEmail) {
            console.warn(`🚫 Unauthorized admin access attempt from: ${userEmail}`);
            return res.status(403).json({
                error: 'Forbidden: Admin access only',
                message: 'You do not have permission to access this resource'
            });
        }

        console.log(`✅ Admin authenticated: ${userEmail}`);
        next();
    } catch (error) {
        console.error('❌ Admin auth error:', error);
        return res.status(500).json({ error: 'Authentication error' });
    }
};

module.exports = adminAuth;
