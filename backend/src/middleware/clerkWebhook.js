const { Webhook } = require('svix');

// Middleware to verify Clerk webhook signatures
function verifyClerkWebhook(req, res, next) {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

        if (!WEBHOOK_SECRET) {
            throw new Error('Clerk webhook secret not configured');
        }

        const headers = req.headers;
        const payload = JSON.stringify(req.body);

        const svix_id = headers['svix-id'];
        const svix_timestamp = headers['svix-timestamp'];
        const svix_signature = headers['svix-signature'];

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({ error: 'Missing svix headers' });
        }

        const wh = new Webhook(WEBHOOK_SECRET);
        const evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });

        req.clerkEvent = evt;
        next();
    } catch (err) {
        console.error('Clerk webhook verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook verification failed' });
    }
}

module.exports = {
    verifyClerkWebhook
};
