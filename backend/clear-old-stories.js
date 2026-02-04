// Script to clear old stories with broken image URLs
const mongoose = require('mongoose');
require('dotenv').config();

const Story = require('./src/models/Story');
const User = require('./src/models/User');

async function clearOldStories() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Delete all stories
        const deletedStories = await Story.deleteMany({});
        console.log(`🗑️  Deleted ${deletedStories.deletedCount} old stories`);

        // Reset all users' story counts
        const updatedUsers = await User.updateMany(
            {},
            {
                $set: {
                    storiesGenerated: 0,
                    creditsRemaining: 0
                }
            }
        );
        console.log(`🔄 Reset story count for ${updatedUsers.modifiedCount} users`);

        console.log('✅ Database cleaned! You can now create fresh stories with working images.');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearOldStories();
