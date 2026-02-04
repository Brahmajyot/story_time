const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const { generateStory } = require('../services/aiService');
const { generateStoryImage } = require('../services/imageService');

// Get user's story count and subscription status
router.get('/count', async (req, res) => {
    try {
        const userId = req.auth.userId; // From Clerk middleware

        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                clerkId: userId,
                email: req.auth.sessionClaims?.email || '',
                firstName: req.auth.sessionClaims?.firstName || '',
                lastName: req.auth.sessionClaims?.lastName || ''
            });
        }

        res.json({
            storiesGenerated: user.storiesGenerated,
            isPremium: user.isPremium,
            subscriptionType: user.subscriptionType,
            creditsRemaining: user.creditsRemaining,
            canGenerateStory: user.isPremium ||
                user.subscriptionType === 'unlimited' ||
                user.creditsRemaining > 0 ||
                user.storiesGenerated < 5
        });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Generate a new story
router.post('/generate', async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { childName, favoriteAnimal, moralLesson } = req.body;

        if (!childName || !favoriteAnimal || !moralLesson) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get user
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            user = await User.create({
                clerkId: userId,
                email: req.auth.sessionClaims?.email || ''
            });
        }

        // Check if user can generate a story
        const canGenerate = user.isPremium ||
            user.subscriptionType === 'unlimited' ||
            user.creditsRemaining > 0 ||
            user.storiesGenerated < 5;

        if (!canGenerate) {
            return res.status(403).json({
                error: 'Story limit reached. Please upgrade to continue.',
                needsPayment: true
            });
        }

        // Generate story and image in parallel
        const [storyText, imageUrl] = await Promise.all([
            generateStory(childName, favoriteAnimal, moralLesson),
            generateStoryImage(childName, favoriteAnimal, moralLesson)
        ]);

        // Save story to database
        const story = await Story.create({
            userId,
            childName,
            favoriteAnimal,
            moralLesson,
            storyText,
            imageUrl
        });

        // Update user's story count
        user.storiesGenerated += 1;

        // Deduct credit if pay-per-use
        if (user.subscriptionType === 'payperuse' && user.creditsRemaining > 0) {
            user.creditsRemaining -= 1;
        }

        await user.save();

        res.json({
            success: true,
            story: {
                id: story._id,
                childName: story.childName,
                favoriteAnimal: story.favoriteAnimal,
                moralLesson: story.moralLesson,
                storyText: story.storyText,
                imageUrl: story.imageUrl,
                createdAt: story.createdAt
            },
            storiesRemaining: user.subscriptionType === 'unlimited' ? 'unlimited' :
                (user.creditsRemaining > 0 ? user.creditsRemaining : (3 - user.storiesGenerated))
        });
    } catch (error) {
        console.error('Error generating story:', error);
        res.status(500).json({ error: 'Failed to generate story' });
    }
});

// Get user's story history
router.get('/', async (req, res) => {
    try {
        const userId = req.auth.userId;

        const stories = await Story.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ stories });
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

// Get a specific story by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.auth.userId;
        const storyId = req.params.id;

        const story = await Story.findOne({ _id: storyId, userId });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.json({ story });
    } catch (error) {
        console.error('Error fetching story:', error);
        res.status(500).json({ error: 'Failed to fetch story' });
    }
});

module.exports = router;
