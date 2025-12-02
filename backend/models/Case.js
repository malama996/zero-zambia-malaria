const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  reporterPhone: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, enum: ['Male', 'Female'], required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  district: { type: String },
  province: { type: String },
  symptoms: [String],
  rdtResult: { type: String, enum: ['Positive', 'Negative'], required: true },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved'],
    default: 'pending'
  },
  interventions: [{
    healthProfessional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true
    },
    notes: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index for geospatial queries
CaseSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Case', CaseSchema);
