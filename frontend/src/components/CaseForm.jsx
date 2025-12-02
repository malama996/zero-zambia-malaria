import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function CaseForm() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        reporterName: '',
        reporterPhone: '',
        patientAge: '',
        patientGender: 'Female',
        symptoms: '',
        rdtResult: 'Positive'
    });
    const [location, setLocation] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        type: 'Point',
                        coordinates: [position.coords.longitude, position.coords.latitude]
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setStatus('Error getting location. Ensure GPS is on.');
                }
            );
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location) {
            setStatus('Location is required. Please wait for GPS.');
            return;
        }

        try {
            setStatus('Submitting...');
            await axios.post(`${API_URL}/cases`, {
                ...formData,
                location,
                symptoms: formData.symptoms.split(',').map(s => s.trim())
            });
            setStatus('Case submitted successfully!');
            setFormData({
                reporterName: '',
                reporterPhone: '',
                patientAge: '',
                patientGender: 'Female',
                symptoms: '',
                rdtResult: 'Positive'
            });
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setStatus('Error submitting case. It may be queued if offline.');
        }
    };

    return (
        <div className="case-form card">
            <h2 style={{ marginTop: 0, color: '#2E7D32' }}>{t('tabs.submit')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('form.reporterName')}</label>
                    <input
                        type="text"
                        value={formData.reporterName}
                        onChange={e => setFormData({ ...formData, reporterName: e.target.value })}
                        required
                        placeholder="Enter name"
                    />
                </div>
                <div className="form-group">
                    <label>{t('form.reporterPhone')}</label>
                    <input
                        type="tel"
                        value={formData.reporterPhone}
                        onChange={e => setFormData({ ...formData, reporterPhone: e.target.value })}
                        required
                        placeholder="097..."
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>{t('form.patientAge')}</label>
                        <input
                            type="number"
                            value={formData.patientAge}
                            onChange={e => setFormData({ ...formData, patientAge: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('form.patientGender')}</label>
                        <select
                            value={formData.patientGender}
                            onChange={e => setFormData({ ...formData, patientGender: e.target.value })}
                        >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>{t('form.symptoms')}</label>
                    <input
                        type="text"
                        value={formData.symptoms}
                        onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                        placeholder="Fever, Chills..."
                    />
                </div>
                <div className="form-group">
                    <label>{t('form.rdtResult')}</label>
                    <select
                        value={formData.rdtResult}
                        onChange={e => setFormData({ ...formData, rdtResult: e.target.value })}
                        style={{ borderColor: formData.rdtResult === 'Positive' ? '#D32F2F' : '#2E7D32' }}
                    >
                        <option value="Positive">Positive</option>
                        <option value="Negative">Negative</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>{t('form.location')}</label>
                    <div style={{
                        padding: '1rem',
                        background: location ? '#E8F5E9' : '#FFF3E0',
                        borderRadius: '8px',
                        color: location ? '#2E7D32' : '#E65100',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        {location ?
                            `✓ GPS Locked: ${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}` :
                            `⟳ ${t('form.gettingLocation')}`}
                    </div>
                </div>

                <button type="submit" className="btn-submit" disabled={!location || status === 'Submitting...'}>
                    {status === 'Submitting...' ? 'Sending...' : t('form.submitBtn')}
                </button>
                {status && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        borderRadius: '8px',
                        background: status.includes('Error') ? '#FFEBEE' : '#E8F5E9',
                        color: status.includes('Error') ? '#C62828' : '#2E7D32',
                        textAlign: 'center'
                    }}>
                        {status}
                    </div>
                )}
            </form>
        </div>
    );
}

export default CaseForm;
