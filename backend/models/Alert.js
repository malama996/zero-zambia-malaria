const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  messages: {
    type: Map,
    of: String,
    required: true
  },
  targetDistricts: [String],
  dominantLanguage: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
