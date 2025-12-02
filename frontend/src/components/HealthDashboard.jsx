import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function HealthDashboard() {
    const { t } = useTranslation();
    const { token, user } = useAuth();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedCase, setSelectedCase] = useState(null);
    const [intervention, setIntervention] = useState({ action: '', notes: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const response = await axios.get(`${API_URL}/cases`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching cases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIntervene = async (caseId) => {
        if (!intervention.action) {
            alert('Please provide an action');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(
                `${API_URL}/cases/${caseId}/intervene`,
                intervention,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Intervention added successfully!');
            setSelectedCase(null);
            setIntervention({ action: '', notes: '' });
            fetchCases(); // Refresh cases
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to add intervention');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCases = cases.filter(c => {
        if (filter === 'all') return true;
        return c.status === filter;
    });

    const stats = {
        total: cases.length,
        pending: cases.filter(c => c.status === 'pending').length,
        investigating: cases.filter(c => c.status === 'investigating').length,
        resolved: cases.filter(c => c.status === 'resolved').length,
        positive: cases.filter(c => c.rdtResult === 'Positive').length
    };

    if (loading) {
        return <div className="loading-container">Loading dashboard...</div>;
    }

    return (
        <div className="health-dashboard">
            <div className="dashboard-header">
                <h2>🏥 Health Professional Dashboard</h2>
                <p>Welcome, {user?.name} - {user?.facility}</p>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Cases</div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card investigating">
                    <div className="stat-value">{stats.investigating}</div>
                    <div className="stat-label">Investigating</div>
                </div>
                <div className="stat-card resolved">
                    <div className="stat-value">{stats.resolved}</div>
                    <div className="stat-label">Resolved</div>
                </div>
                <div className="stat-card positive">
                    <div className="stat-value">{stats.positive}</div>
                    <div className="stat-label">Positive Cases</div>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All Cases
                </button>
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={filter === 'investigating' ? 'active' : ''}
                    onClick={() => setFilter('investigating')}
                >
                    Investigating
                </button>
                <button
                    className={filter === 'resolved' ? 'active' : ''}
                    onClick={() => setFilter('resolved')}
                >
                    Resolved
                </button>
            </div>

            {/* Cases Table */}
            <div className="cases-table-container">
                <table className="cases-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>District</th>
                            <th>Age/Gender</th>
                            <th>RDT Result</th>
                            <th>Status</th>
                            <th>Interventions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCases.map(c => (
                            <tr key={c._id}>
                                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                <td>{c.district || 'Unknown'}</td>
                                <td>{c.patientAge}y / {c.patientGender}</td>
                                <td>
                                    <span className={`badge ${c.rdtResult.toLowerCase()}`}>
                                        {c.rdtResult}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${c.status}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>{c.interventions?.length || 0}</td>
                                <td>
                                    <button
                                        className="btn-intervene"
                                        onClick={() => setSelectedCase(c)}
                                    >
                                        Intervene
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Intervention Modal */}
            {selectedCase && (
                <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add Intervention</h3>
                        <div className="case-details">
                            <p><strong>Patient:</strong> {selectedCase.patientAge}y, {selectedCase.patientGender}</p>
                            <p><strong>District:</strong> {selectedCase.district}</p>
                            <p><strong>RDT:</strong> {selectedCase.rdtResult}</p>
                            <p><strong>Symptoms:</strong> {selectedCase.symptoms?.join(', ')}</p>
                        </div>

                        {selectedCase.interventions?.length > 0 && (
                            <div className="previous-interventions">
                                <h4>Previous Interventions:</h4>
                                {selectedCase.interventions.map((int, idx) => (
                                    <div key={idx} className="intervention-item">
                                        <strong>{int.healthProfessional?.name}</strong> - {new Date(int.timestamp).toLocaleString()}
                                        <p>{int.action}</p>
                                        {int.notes && <p className="notes">{int.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="intervention-form">
                            <div className="form-group">
                                <label>Action Taken *</label>
                                <select
                                    value={intervention.action}
                                    onChange={(e) => setIntervention({ ...intervention, action: e.target.value })}
                                    required
                                >
                                    <option value="">Select action...</option>
                                    <option value="Patient contacted">Patient contacted</option>
                                    <option value="Treatment provided">Treatment provided</option>
                                    <option value="Referred to hospital">Referred to hospital</option>
                                    <option value="Follow-up scheduled">Follow-up scheduled</option>
                                    <option value="Case investigated">Case investigated</option>
                                    <option value="Community alert sent">Community alert sent</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Notes (Optional)</label>
                                <textarea
                                    value={intervention.notes}
                                    onChange={(e) => setIntervention({ ...intervention, notes: e.target.value })}
                                    rows={4}
                                    placeholder="Additional details about the intervention..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setSelectedCase(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-submit"
                                    onClick={() => handleIntervene(selectedCase._id)}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Intervention'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .health-dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h2 {
          color: var(--who-blue);
          margin-bottom: 0.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid var(--who-blue);
        }

        .stat-card.pending { border-left-color: #FFA000; }
        .stat-card.investigating { border-left-color: #0093D5; }
        .stat-card.resolved { border-left-color: #198A00; }
        .stat-card.positive { border-left-color: #DE2010; }

        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--who-blue);
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .filter-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-bar button {
          padding: 0.75rem 1.5rem;
          border: 2px solid #E0E0E0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-bar button.active {
          background: var(--who-blue);
          color: white;
          border-color: var(--who-blue);
        }

        .cases-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .cases-table {
          width: 100%;
          border-collapse: collapse;
        }

        .cases-table th {
          background: var(--who-blue);
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
        }

        .cases-table td {
          padding: 1rem;
          border-bottom: 1px solid #E0E0E0;
        }

        .cases-table tr:hover {
          background: #F5F5F5;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge.positive {
          background: #FEE;
          color: #DE2010;
        }

        .badge.negative {
          background: #E8F5E9;
          color: #198A00;
        }

        .badge.pending {
          background: #FFF3E0;
          color: #FFA000;
        }

        .badge.investigating {
          background: #E3F2FD;
          color: #0093D5;
        }

        .badge.resolved {
          background: #E8F5E9;
          color: #198A00;
        }

        .btn-intervene {
          padding: 0.5rem 1rem;
          background: var(--who-blue);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-intervene:hover {
          background: var(--who-blue-dark);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          color: var(--who-blue);
          margin-bottom: 1rem;
        }

        .case-details {
          background: #F5F5F5;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .case-details p {
          margin: 0.5rem 0;
        }

        .previous-interventions {
          margin-bottom: 1.5rem;
        }

        .intervention-item {
          background: #E3F2FD;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .intervention-item .notes {
          font-style: italic;
          color: #666;
        }

        .intervention-form .form-group {
          margin-bottom: 1rem;
        }

        .intervention-form label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .intervention-form select,
        .intervention-form textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #E0E0E0;
          border-radius: 8px;
          font-size: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: #E0E0E0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          font-size: 1.2rem;
          color: var(--who-blue);
        }
      `}</style>
        </div>
    );
}

export default HealthDashboard;
