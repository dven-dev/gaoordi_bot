const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  username: String,
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
