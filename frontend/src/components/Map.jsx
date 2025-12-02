import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock data for fallback/demo mode
const MOCK_CASES = [
    { _id: '1', location: { coordinates: [28.3228, -15.3875] }, rdtResult: 'Positive', district: 'Lusaka', patientAge: 25, patientGender: 'Male', createdAt: new Date().toISOString() },
    { _id: '2', location: { coordinates: [28.2500, -15.4000] }, rdtResult: 'Negative', district: 'Lusaka', patientAge: 12, patientGender: 'Female', createdAt: new Date().toISOString() },
    { _id: '3', location: { coordinates: [27.8493, -13.1339] }, rdtResult: 'Positive', district: 'Ndola', patientAge: 45, patientGender: 'Female', createdAt: new Date().toISOString() },
    { _id: '4', location: { coordinates: [25.8570, -17.8470] }, rdtResult: 'Positive', district: 'Livingstone', patientAge: 30, patientGender: 'Male', createdAt: new Date().toISOString() },
    { _id: '5', location: { coordinates: [31.3333, -11.8333] }, rdtResult: 'Negative', district: 'Mpika', patientAge: 8, patientGender: 'Male', createdAt: new Date().toISOString() }
];

function Map() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMock, setUsingMock] = useState(false);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/cases`, { timeout: 5000 });
                setCases(res.data);
                setError(null);
                setUsingMock(false);
            } catch (err) {
                console.error("Error fetching cases:", err);
                // Fallback to mock data if API fails
                setCases(MOCK_CASES);
                setUsingMock(true);
                // Only show error if we strictly want to warn about backend
                // setError("Could not connect to live server. Showing demo data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
        const interval = setInterval(fetchCases, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading && cases.length === 0) {
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p style={{ color: '#0093D5', fontWeight: 600 }}>Loading map data...</p>
                <style>{`
                    .map-loading {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        min-height: 500px;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .spinner {
                        width: 50px;
                        height: 50px;
                        border: 5px solid #E0F7FA;
                        border-top: 5px solid #0093D5;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Calculate center based on cases
    const avgLat = cases.length > 0 ? cases.reduce((sum, c) => sum + c.location.coordinates[1], 0) / cases.length : -13.1339;
    const avgLng = cases.length > 0 ? cases.reduce((sum, c) => sum + c.location.coordinates[0], 0) / cases.length : 27.8493;

    return (
        <div style={{
            height: '100%',
            width: '100%',
            minHeight: '600px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            position: 'relative'
        }}>
            {usingMock && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    background: '#FFA000',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    Demo Mode (Backend Unavailable)
                </div>
            )}

            <MapContainer
                center={[avgLat, avgLng]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {cases.map((c, index) => (
                    <CircleMarker
                        key={c._id || index}
                        center={[c.location.coordinates[1], c.location.coordinates[0]]}
                        radius={10}
                        fillColor={c.rdtResult === 'Positive' ? '#DE2010' : '#198A00'} // Zambian Red/Green
                        color="white"
                        weight={2}
                        fillOpacity={0.8}
                    >
                        <Popup>
                            <div style={{ minWidth: '180px', padding: '0.5rem' }}>
                                <strong style={{
                                    color: c.rdtResult === 'Positive' ? '#DE2010' : '#198A00',
                                    fontSize: '1.1rem',
                                    display: 'block',
                                    marginBottom: '0.75rem'
                                }}>
                                    {c.rdtResult === 'Positive' ? '🦟 Positive Case' : '✓ Negative Case'}
                                </strong>
                                <div style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
                                    <strong>District:</strong> {c.district || 'Unknown'}<br />
                                    <strong>Age:</strong> {c.patientAge}<br />
                                    <strong>Gender:</strong> {c.patientGender}<br />
                                    <strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                fontSize: '0.9rem',
                border: '1px solid rgba(0, 147, 213, 0.2)',
                zIndex: 1000
            }}>
                <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#0093D5' }}>Legend</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#DE2010',
                        boxShadow: '0 2px 4px rgba(222, 32, 16, 0.3)'
                    }}></div>
                    <span>Positive <strong>({cases.filter(c => c.rdtResult === 'Positive').length})</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#198A00',
                        boxShadow: '0 2px 4px rgba(25, 138, 0, 0.3)'
                    }}></div>
                    <span>Negative <strong>({cases.filter(c => c.rdtResult === 'Negative').length})</strong></span>
                </div>
            </div>
        </div>
    );
}

export default Map;
