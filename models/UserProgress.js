const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  chatId: { type: Number, required: true },  // добавлен chatId
  currentScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  currentStep: { type: Number, default: 0 }
});

// Уникальный индекс по userId + chatId, чтобы upsert был безопасным
UserProgressSchema.index({ userId: 1, chatId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);
