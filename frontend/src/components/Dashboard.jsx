import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Dashboard() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ total: 0, outbreaks: [], cases: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [casesRes, outbreaksRes] = await Promise.all([
                    axios.get(`${API_URL}/cases`),
                    axios.get(`${API_URL}/outbreaks/generate`)
                ]);

                setStats({
                    total: casesRes.data.length,
                    outbreaks: outbreaksRes.data,
                    cases: casesRes.data
                });
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSendAlert = async (district) => {
        try {
            const payload = {
                targetDistricts: [district],
                messages: {
                    en: `ALERT: Malaria outbreak detected in ${district}. Sleep under a net!`,
                    bem: `ICILANDILO: Ubulwele bwa malaria nabufula mu ${district}. Lalamika mu sanda!`,
                    nya: `CHENJEZO: Malaria yafika pa ${district}. Gonani mu net!`,
                    to: `CHENJEZO: Malaria yafika pa ${district}.!`,
                    loz: `TEMOSO: Malaria ifitile mwa ${district}.!`,
                    kqn: `JIMUNO: Malaria yafika pa ${district}.!`,
                    lun: `CHIJIKU: Malaria yafika pa ${district}.!`,
                    luv: `CHINYENGE: Malaria yafika pa ${district}.!`
                }
            };

            await axios.post(`${API_URL}/sms/alert`, payload);
            alert(`Multi-lingual alert sent for ${district}`);
        } catch (err) {
            console.error(err);
            alert('Failed to send alert');
        }
    };

    // Prepare chart data
    const districtData = stats.cases.reduce((acc, c) => {
        const district = c.district || 'Unknown';
        acc[district] = (acc[district] || 0) + 1;
        return acc;
    }, {});

    const barChartData = {
        labels: Object.keys(districtData),
        datasets: [{
            label: 'Cases by District',
            data: Object.values(districtData),
            backgroundColor: '#2E7D32',
            borderColor: '#1B5E20',
            borderWidth: 1
        }]
    };

    // Cases over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const casesPerDay = last7Days.map(date => {
        return stats.cases.filter(c => c.createdAt.startsWith(date)).length;
    });

    const lineChartData = {
        labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'Daily Cases',
            data: casesPerDay,
            borderColor: '#D32F2F',
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            tension: 0.4
        }]
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #E8F5E9',
                    borderTop: '5px solid #2E7D32',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h2 style={{ color: '#2E7D32', marginTop: 0 }}>{t('tabs.dashboard')}</h2>

            <div className="stat-grid">
                <div className="stat-card">
                    <h3>{t('dashboard.totalCases')}</h3>
                    <p className="stat-value" style={{ color: '#2E7D32' }}>{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>{t('dashboard.outbreaks')}</h3>
                    <p className="stat-value" style={{ color: '#D32F2F' }}>{stats.outbreaks.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Positive Rate</h3>
                    <p className="stat-value" style={{ color: '#FF6F00' }}>
                        {stats.total > 0 ? Math.round((stats.cases.filter(c => c.rdtResult === 'Positive').length / stats.total) * 100) : 0}%
                    </p>
                </div>
                <div className="stat-card">
                    <h3>Last 24h</h3>
                    <p className="stat-value" style={{ color: '#1976D2' }}>
                        {stats.cases.filter(c => new Date(c.createdAt) > new Date(Date.now() - 86400000)).length}
                    </p>
                </div>
            </div>

            {stats.cases.length > 0 && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0, color: '#455A64' }}>📈 Case Trends (Last 7 Days)</h3>
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
            )}

            {Object.keys(districtData).length > 0 && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0, color: '#455A64' }}>📊 Cases by District</h3>
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
            )}

            <h3 style={{ color: '#455A64' }}>🚨 Outbreak Alerts</h3>
            {stats.outbreaks.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#90A4AE', background: 'white', borderRadius: '8px' }}>
                    ✅ No active outbreaks detected.
                </div>
            ) : (
                <ul className="outbreak-list">
                    {stats.outbreaks.map((o, i) => (
                        <li key={i} className="outbreak-item">
                            <div>
                                <strong style={{ fontSize: '1.1rem', color: '#C62828' }}>{o.district}</strong><br />
                                <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                    Cases: {o.currentCount} (was {o.previousCount})<br />
                                    Increase: <strong>+{o.increase.toFixed(1)}%</strong>
                                </span>
                            </div>
                            <button
                                onClick={() => handleSendAlert(o.district)}
                                className="alert-btn"
                            >
                                📱 SMS Alert
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;
