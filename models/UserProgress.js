const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  currentScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  currentStep: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
