const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
  name: { type: String, required: true },
  province: { type: String, required: true },
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      required: true
    },
    coordinates: {
      type: [],
      required: true
    }
  }
});

DistrictSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('District', DistrictSchema);
