const District = require('../models/District');

async function assignLocation(coordinates) {
  try {
    // coordinates is [lng, lat]
    const district = await District.findOne({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: coordinates
          }
        }
      }
    });

    if (district) {
      return { district: district.name, province: district.province };
    }
    return { district: 'Unknown', province: 'Unknown' };
  } catch (err) {
    console.error('Geo assignment error:', err);
    return { district: 'Unknown', province: 'Unknown' };
  }
}

module.exports = { assignLocation };
