const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  steps: { type: Array, default: [] }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
