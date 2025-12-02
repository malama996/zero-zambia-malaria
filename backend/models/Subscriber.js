const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  preferredLanguage: { 
    type: String, 
    enum: ['en', 'bem', 'nya', 'to', 'loz', 'kqn', 'lun', 'luv'],
    default: 'en'
  },
  district: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
