import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom hospital icon
const hospitalIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iIzJFN0QzMiIvPjxyZWN0IHg9IjE0IiB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSIxNiIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI4IiB5PSIxNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjQiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Component to update map view when location changes
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 12);
        }
    }, [center, map]);
    return null;
}

function Hospitals() {
    const { t } = useTranslation();
    const [userLocation, setUserLocation] = useState(null);
    const [selectedType, setSelectedType] = useState('all');
    const [mapCenter, setMapCenter] = useState([-15.4167, 28.2833]); // Lusaka default

    // Mock hospital data for Zambia (major cities)
    const hospitals = [
        // Lusaka
        { id: 1, name: 'University Teaching Hospital (UTH)', type: 'hospital', lat: -15.3875, lng: 28.3228, phone: '+260 211 252 661', district: 'Lusaka' },
        { id: 2, name: 'Levy Mwanawasa General Hospital', type: 'hospital', lat: -15.4258, lng: 28.2853, phone: '+260 211 256 000', district: 'Lusaka' },
        { id: 3, name: 'Matero Main Clinic', type: 'clinic', lat: -15.3667, lng: 28.2500, phone: '+260 211 231 234', district: 'Lusaka' },
        { id: 4, name: 'Kanyama Clinic', type: 'clinic', lat: -15.4500, lng: 28.2333, phone: '+260 211 245 678', district: 'Lusaka' },
        { id: 5, name: 'Chilenje Health Post', type: 'health_post', lat: -15.4000, lng: 28.3167, phone: '+260 211 239 456', district: 'Lusaka' },

        // Copperbelt
        { id: 6, name: 'Ndola Central Hospital', type: 'hospital', lat: -12.9667, lng: 28.6333, phone: '+260 212 612 000', district: 'Ndola' },
        { id: 7, name: 'Kitwe Central Hospital', type: 'hospital', lat: -12.8167, lng: 28.2167, phone: '+260 212 223 000', district: 'Kitwe' },
        { id: 8, name: 'Nkana Mine Hospital', type: 'hospital', lat: -12.8000, lng: 28.2500, phone: '+260 212 224 567', district: 'Kitwe' },

        // Southern Province
        { id: 9, name: 'Livingstone General Hospital', type: 'hospital', lat: -17.8419, lng: 25.8544, phone: '+260 213 321 000', district: 'Livingstone' },
        { id: 10, name: 'Maramba Clinic', type: 'clinic', lat: -17.8500, lng: 25.8667, phone: '+260 213 322 123', district: 'Livingstone' },

        // Western Province
        { id: 11, name: 'Lewanika General Hospital', type: 'hospital', lat: -15.2667, lng: 23.1333, phone: '+260 217 221 000', district: 'Mongu' },
        { id: 12, name: 'Mongu Urban Clinic', type: 'clinic', lat: -15.2500, lng: 23.1500, phone: '+260 217 221 456', district: 'Mongu' },
    ];

    useEffect(() => {
        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(location);
                    setMapCenter(location);
                },
                (error) => {
                    console.log('Location access denied:', error);
                }
            );
        }
    }, []);

    const filteredHospitals = selectedType === 'all'
        ? hospitals
        : hospitals.filter(h => h.type === selectedType);

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    return (
        <div className="hospitals-page">
            <div className="page-header">
                <h2 className="page-title">🏥 {t('hospitals.pageTitle')}</h2>
                <p className="page-subtitle">{t('hospitals.pageSubtitle')}</p>
            </div>

            {/* Filter */}
            <div className="hospitals-filter card">
                <label htmlFor="facility-type">{t('hospitals.filterLabel')}</label>
                <select
                    id="facility-type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="facility-filter-select"
                >
                    <option value="all">{t('hospitals.allFacilities')}</option>
                    <option value="hospital">{t('hospitals.hospitals')}</option>
                    <option value="clinic">{t('hospitals.clinics')}</option>
                    <option value="health_post">{t('hospitals.healthPosts')}</option>
                </select>
            </div>

            {/* Map */}
            <div className="hospitals-map-container card">
                <MapContainer
                    center={mapCenter}
                    zoom={userLocation ? 12 : 6}
                    style={{ height: '400px', width: '100%', borderRadius: '8px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapUpdater center={mapCenter} />

                    {/* User location marker */}
                    {userLocation && (
                        <Marker position={userLocation}>
                            <Popup>
                                <strong>{t('hospitals.yourLocation')}</strong>
                            </Popup>
                        </Marker>
                    )}

                    {/* Hospital markers */}
                    {filteredHospitals.map(hospital => (
                        <Marker
                            key={hospital.id}
                            position={[hospital.lat, hospital.lng]}
                            icon={hospitalIcon}
                        >
                            <Popup>
                                <div className="hospital-popup">
                                    <strong>{hospital.name}</strong><br />
                                    <span className="facility-type-badge">{hospital.type.replace('_', ' ')}</span><br />
                                    📍 {hospital.district}<br />
                                    📞 {hospital.phone}<br />
                                    {userLocation && (
                                        <small>
                                            📏 {calculateDistance(userLocation[0], userLocation[1], hospital.lat, hospital.lng)} km away
                                        </small>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* List View */}
            <div className="hospitals-list">
                <h3 className="section-heading">{t('hospitals.facilitiesList')}</h3>
                {filteredHospitals.map(hospital => {
                    const distance = userLocation
                        ? calculateDistance(userLocation[0], userLocation[1], hospital.lat, hospital.lng)
                        : null;

                    return (
                        <div key={hospital.id} className="hospital-card card">
                            <div className="hospital-header">
                                <h4 className="hospital-name">{hospital.name}</h4>
                                <span className={`facility-badge ${hospital.type}`}>
                                    {hospital.type === 'hospital' && '🏥'}
                                    {hospital.type === 'clinic' && '⚕️'}
                                    {hospital.type === 'health_post' && '🏪'}
                                    {' '}{hospital.type.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="hospital-details">
                                <p>📍 {hospital.district}</p>
                                <p>📞 {hospital.phone}</p>
                                {distance && <p>📏 {distance} km {t('hospitals.away')}</p>}
                            </div>
                            <button
                                onClick={() => setMapCenter([hospital.lat, hospital.lng])}
                                className="btn-view-map"
                            >
                                🗺️ {t('hospitals.viewOnMap')}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Info Card */}
            <div className="info-card card">
                <h3>ℹ️ {t('hospitals.needHelp')}</h3>
                <p>{t('hospitals.helpText')}</p>
                <div className="emergency-numbers">
                    <div className="emergency-item">
                        <strong>📞 {t('hospitals.emergency')}</strong>
                        <p>991 / 992</p>
                    </div>
                    <div className="emergency-item">
                        <strong>🏥 {t('hospitals.healthHotline')}</strong>
                        <p>909</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hospitals;
