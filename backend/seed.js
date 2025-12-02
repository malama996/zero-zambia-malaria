const mongoose = require('mongoose');
const District = require('./models/District');
require('dotenv').config();

const districts = [
  {
    name: 'Lusaka',
    province: 'Lusaka',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [28.1, -15.3], [28.5, -15.3], [28.5, -15.6], [28.1, -15.6], [28.1, -15.3]
      ]]
    }
  },
  {
    name: 'Ndola',
    province: 'Copperbelt',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [28.5, -12.9], [28.7, -12.9], [28.7, -13.1], [28.5, -13.1], [28.5, -12.9]
      ]]
    }
  },
  {
    name: 'Kitwe',
    province: 'Copperbelt',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [28.1, -12.7], [28.3, -12.7], [28.3, -12.9], [28.1, -12.9], [28.1, -12.7]
      ]]
    }
  },
  {
    name: 'Livingstone',
    province: 'Southern',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [25.7, -17.7], [26.0, -17.7], [26.0, -17.9], [25.7, -17.9], [25.7, -17.7]
      ]]
    }
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await District.deleteMany({});
    await District.insertMany(districts);
    console.log('Districts seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
