# Zero Malaria Zambia | MapTrack

A production-ready, full-stack malaria tracking application for Zambia with geospatial capabilities, intelligent SMS alerts, and multi-lingual support.


## 🎯 Overview

**MapTrack** is a comprehensive public health tool designed to:
- Track malaria cases in real-time across Zambia
- Detect outbreaks automatically (50%+ case increase)
- Send intelligent, multi-lingual SMS alerts
- Provide data visualization for health officials
- Work offline via Progressive Web App (PWA) technology

## ✨ Key Features

### For Community Health Workers (CHWs)
- ✅ Quick case submission with GPS auto-location
- ✅ Offline-capable form submission
- ✅ Multi-lingual interface (8 languages)
- ✅ Simple, intuitive mobile-first design

### For Health Officials
- ✅ Real-time dashboard with statistics
- ✅ Interactive maps with heatmaps
- ✅ Trend analysis with charts (7-day trends, district breakdown)
- ✅ One-click multi-lingual SMS alerts to district teams
- ✅ Automated outbreak detection

### For General Public
- ✅ View outbreak alerts on interactive map
- ✅ Understand malaria risk in their area
- ✅ Access in their native language

## 🌍 Supported Languages

1. **English** (en)
2. **Icibemba** (bem) - with full translations
3. **Cinyanja** (nya) - placeholder ready
4. **Chitonga** (to) - placeholder ready
5. **Silozi** (loz) - placeholder ready
6. **Kiikaonde** (kqn) - placeholder ready
7. **Lunda** (lun) - placeholder ready
8. **Luvale** (luv) - placeholder ready

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Geospatial**: MongoDB 2dsphere indexing
- **SMS**: Africa's Talking API
- **Security**: Helmet.js, CORS

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Chart.js + React-ChartJS-2
- **Localization**: i18next + react-i18next
- **PWA**: vite-plugin-pwa
- **HTTP Client**: Axios

### First-Time Users
1. Click the **❓ Help** button in the header to see the welcome guide
2. Select your preferred language from the dropdown

### Submitting a Case
1. Go to the "Submit Case" tab
2. Allow location access when prompted
3. Fill in patient details (name, age, gender, RDT result)
4. Wait for GPS lock (green indicator)
5. Click "Submit Report"

### Viewing the Map
1. Go to the "Alert Map" tab
2. Red markers = Positive cases
3. Green markers = Negative cases
4. Click markers for details

### Monitoring Dashboard (Health Officials)
1. Go to the "Dashboard" tab
2. View statistics: Total cases, outbreaks, positive rate, 24h cases
3. See charts: 7-day trend line, district bar chart
4. Click "SMS Alert" on outbreaks to send multi-lingual notifications

## 🗺 Geospatial Features

The application uses MongoDB's geospatial capabilities:
- **Auto-district assignment**: Cases are automatically assigned to districts based on GPS coordinates
- **2dsphere indexing**: Optimized queries for location-based data
- **District boundaries**: Simplified GeoJSON polygons for major Zambian districts

### Seeded Districts
- Lusaka (Lusaka Province)
- Ndola, Kitwe (Copperbelt)
- Livingstone (Southern)
- Mongu (Western)

## 🚨 Intelligent SMS Alert System

The SMS system automatically:
1. Determines the dominant language for each district
2. Checks subscriber preferences
3. Sends messages in the appropriate language

**Example**: An outbreak in Mongu would send Silozi messages by default, but users who set their preference to English would receive English messages.

## 🤝 Contributing

This is a public health tool. Contributions are welcome, especially:
- Translation improvements for Bemba and other languages
- Additional Zambian district GeoJSON boundaries
- UI/UX enhancements
- Performance optimizations

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Africa's Talking** for SMS capabilities
- **OpenStreetMap** contributors
- **Zero Malaria Zambia** initiative
- Community Health Workers across Zambia

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact the health ministry IT team

**Built with ❤️ for Zero Malaria Zambia**
