const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  steps: { type: Array, default: [] } // массив шагов
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
