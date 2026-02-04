const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const adminAuth = require('../middleware/admin');

// Apply admin auth to all routes
router.use(adminAuth);

// GET /api/admin/users - Get all users with their stats
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('email firstName lastName storiesGenerated isPremium subscriptionType createdAt clerkId')
            .sort({ createdAt: -1 });

        console.log(`📊 Admin fetched ${users.length} users`);

        res.json({
            success: true,
            users: users.map(user => ({
                id: user._id,
                clerkId: user.clerkId,
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
                storiesGenerated: user.storiesGenerated,
                isPremium: user.isPremium,
                subscriptionType: user.subscriptionType,
                createdAt: user.createdAt
            }))
        });
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// PUT /api/admin/users/:userId/premium - Toggle premium status
router.put('/users/:userId/premium', async (req, res) => {
    try {
        const { userId } = req.params;
        const { isPremium } = req.body;

        if (typeof isPremium !== 'boolean') {
            return res.status(400).json({ error: 'isPremium must be a boolean' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update premium status
        user.isPremium = isPremium;
        user.subscriptionType = isPremium ? 'unlimited' : 'free';
        await user.save();

        console.log(`💎 Admin ${isPremium ? 'approved' : 'revoked'} premium for user: ${user.email}`);

        res.json({
            success: true,
            message: `Premium ${isPremium ? 'approved' : 'revoked'} for ${user.email}`,
            user: {
                id: user._id,
                email: user.email,
                isPremium: user.isPremium,
                subscriptionType: user.subscriptionType
            }
        });
    } catch (error) {
        console.error('❌ Error toggling premium:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const [totalUsers, premiumUsers, totalStories] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isPremium: true }),
            Story.countDocuments()
        ]);

        const freeUsers = totalUsers - premiumUsers;

        console.log('📊 Admin fetched statistics');

        res.json({
            success: true,
            stats: {
                totalUsers,
                premiumUsers,
                freeUsers,
                totalStories,
                premiumPercentage: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0
            }
        });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// GET /api/admin/check - Check if current user is admin
router.get('/check', async (req, res) => {
    // If they got here, they passed admin auth
    res.json({
        success: true,
        isAdmin: true,
        email: req.auth?.sessionClaims?.email
    });
});

// GET /api/admin/users/:userId/stories - Get all stories for a specific user
router.get('/users/:userId/stories', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stories = await Story.find({ userId: user.clerkId })
            .sort({ createdAt: -1 })
            .select('childName favoriteAnimal moralLesson readingTimeMinutes storyText createdAt');

        console.log(`📚 Admin fetched ${stories.length} stories for user: ${user.email}`);

        res.json({
            success: true,
            user: {
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim()
            },
            stories: stories.map(story => ({
                id: story._id,
                childName: story.childName,
                favoriteAnimal: story.favoriteAnimal,
                moralLesson: story.moralLesson,
                readingTime: story.readingTimeMinutes,
                preview: story.storyText.substring(0, 150) + '...',
                createdAt: story.createdAt
            }))
        });
    } catch (error) {
        console.error('❌ Error fetching user stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

module.exports = router;
