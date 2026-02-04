const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    childName: {
        type: String,
        required: true
    },
    favoriteAnimal: {
        type: String,
        required: true
    },
    moralLesson: {
        type: String,
        required: true
    },
    storyText: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    readingTimeMinutes: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
