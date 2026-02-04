const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  storiesGenerated: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'unlimited', 'payperuse'],
    default: 'free'
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  creditsRemaining: {
    type: Number,
    default: 0 // For pay-per-use credits
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
