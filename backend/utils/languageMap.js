// Static mapping of districts to dominant languages
// In a real app, this might be more granular or database-driven

const districtLanguageMap = {
  // Lusaka Province
  'Lusaka': 'en', // Urban, mixed
  'Chongwe': 'nya',
  
  // Copperbelt
  'Ndola': 'bem',
  'Kitwe': 'bem',
  
  // Southern
  'Livingstone': 'to',
  'Choma': 'to',
  'Mazabuka': 'to',
  
  // Western
  'Mongu': 'loz',
  'Kaoma': 'loz',
  
  // North-Western
  'Solwezi': 'kqn',
  'Mwinilunga': 'lun',
  'Zambezi': 'luv',
  
  // Eastern
  'Chipata': 'nya',
  
  // Northern / Luapula
  'Kasama': 'bem',
  'Mansa': 'bem'
};

function getDominantLanguage(district) {
  return districtLanguageMap[district] || 'en'; // Default to English
}

module.exports = { getDominantLanguage };
