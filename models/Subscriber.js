const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  chatId: {
    type: Number,
    required: true
  },
  username: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Уникальность userId + chatId, чтобы не было дубликатов
SubscriberSchema.index({ userId: 1, chatId: 1 }, { unique: true });

module.exports = mongoose.model('Subscriber', SubscriberSchema);
