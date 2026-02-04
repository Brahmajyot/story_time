const express = require('express');
const router = express.Router();
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Stripe webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.client_reference_id;
                const customerId = session.customer;
                const subscriptionId = session.subscription;

                // Determine subscription type from metadata
                const subscriptionType = session.metadata?.subscription_type || 'unlimited';

                if (subscriptionType === 'payperuse') {
                    // One-time payment for credits
                    const creditsToAdd = parseInt(session.metadata?.credits || '1', 10);

                    await User.findOneAndUpdate(
                        { clerkId: userId },
                        {
                            $inc: { creditsRemaining: creditsToAdd },
                            stripeCustomerId: customerId
                        }
                    );
                } else {
                    // Subscription for unlimited stories
                    await User.findOneAndUpdate(
                        { clerkId: userId },
                        {
                            isPremium: true,
                            subscriptionType: 'unlimited',
                            stripeCustomerId: customerId,
                            stripeSubscriptionId: subscriptionId
                        }
                    );
                }
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer;

                const isActive = subscription.status === 'active';

                await User.findOneAndUpdate(
                    { stripeCustomerId: customerId },
                    {
                        isPremium: isActive,
                        subscriptionType: isActive ? 'unlimited' : 'free'
                    }
                );
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const customerId = invoice.customer;

                await User.findOneAndUpdate(
                    { stripeCustomerId: customerId },
                    {
                        isPremium: false,
                        subscriptionType: 'free'
                    }
                );
                break;
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Stripe webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

module.exports = router;
