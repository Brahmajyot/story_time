const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyClerkWebhook } = require('../middleware/clerkWebhook');

// Clerk webhook endpoint for user creation/updates
router.post('/clerk', express.raw({ type: 'application/json' }), verifyClerkWebhook, async (req, res) => {
    try {
        const event = req.clerkEvent;

        if (event.type === 'user.created' || event.type === 'user.updated') {
            const { id, email_addresses, first_name, last_name } = event.data;

            const email = email_addresses?.[0]?.email_address || '';

            // Upsert user in database
            await User.findOneAndUpdate(
                { clerkId: id },
                {
                    clerkId: id,
                    email,
                    firstName: first_name,
                    lastName: last_name
                },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Clerk webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

module.exports = router;
