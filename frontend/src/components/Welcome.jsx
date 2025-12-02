import React from 'react';
import { useTranslation } from 'react-i18next';

function Welcome({ onClose }) {
    const { t } = useTranslation();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '12px 12px 0 0',
                    textAlign: 'center'
                }}>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>🦟 Zero Malaria Zambia</h1>
                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>MapTrack</p>
                </div>

                <div style={{ padding: '2rem' }}>
                    <h2 style={{ color: '#2E7D32', marginTop: 0 }}>Welcome!</h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: '#455A64', fontSize: '1rem', marginBottom: '0.5rem' }}>
                            🎯 Our Mission
                        </h3>
                        <p style={{ color: '#666', lineHeight: 1.6 }}>
                            Help eliminate malaria in Zambia by tracking cases in real-time and alerting health officials to outbreaks.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: '#455A64', fontSize: '1rem', marginBottom: '0.5rem' }}>
                            👥 Who Can Use This?
                        </h3>
                        <ul style={{ color: '#666', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                            <li><strong>Community Health Workers:</strong> Submit case reports</li>
                            <li><strong>General Public:</strong> View outbreak alerts</li>
                            <li><strong>Health Officials:</strong> Monitor trends and send alerts</li>
                        </ul>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: '#455A64', fontSize: '1rem', marginBottom: '0.5rem' }}>
                            📱 How It Works
                        </h3>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'start' }}>
                                <div style={{
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>1</div>
                                <div>
                                    <strong style={{ color: '#2E7D32' }}>Submit Case</strong>
                                    <p style={{ margin: '0.2rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                        Report malaria cases with GPS location
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'start' }}>
                                <div style={{
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>2</div>
                                <div>
                                    <strong style={{ color: '#2E7D32' }}>View Map</strong>
                                    <p style={{ margin: '0.2rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                        See real-time case distribution
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'start' }}>
                                <div style={{
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>3</div>
                                <div>
                                    <strong style={{ color: '#2E7D32' }}>Monitor Dashboard</strong>
                                    <p style={{ margin: '0.2rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                        Track trends and send SMS alerts
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: '#FFF3E0',
                        padding: '1rem',
                        borderRadius: '8px',
                        borderLeft: '4px solid #FF6F00',
                        marginBottom: '1.5rem'
                    }}>
                        <strong style={{ color: '#E65100' }}>💡 Tip:</strong>
                        <p style={{ margin: '0.3rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                            Use the language selector (top right) to switch between English, Bemba, Nyanja, and more!
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(to right, #2E7D32, #1B5E20)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)'
                        }}
                    >
                        Get Started →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
