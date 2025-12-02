import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // In a real app, we'd have a dedicated endpoint for this
                // For now, we'll simulate or assume an endpoint exists
                // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/audit-logs`);
                // setLogs(response.data);

                // Mock data for demonstration since we haven't built the admin endpoint yet
                setLogs([
                    { id: 1, action: 'user_login', user: 'Dr. Test', timestamp: new Date().toISOString(), details: 'Login successful' },
                    { id: 2, action: 'case_submitted', user: 'John Doe', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'New case in Lusaka' },
                    { id: 3, action: 'intervention_added', user: 'Dr. Test', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Deployed CHW team' },
                ]);
            } catch (error) {
                console.error('Error fetching logs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (user?.role !== 'admin' && user?.role !== 'health_professional') {
        return <div className="admin-container">Access Denied. Admins only.</div>;
    }

    const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.action === filter);

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>System Audit Logs</h1>
                <div className="filter-controls">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Actions</option>
                        <option value="user_login">Logins</option>
                        <option value="case_submitted">Case Submissions</option>
                        <option value="intervention_added">Interventions</option>
                    </select>
                </div>
            </div>

            <div className="logs-card">
                {loading ? (
                    <p>Loading logs...</p>
                ) : (
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Action</th>
                                <th>User</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td><span className={`badge ${log.action}`}>{log.action.replace('_', ' ')}</span></td>
                                    <td>{log.user}</td>
                                    <td>{typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style>{`
                .admin-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .admin-header h1 {
                    color: var(--who-blue);
                }
                .logs-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    overflow: hidden;
                    padding: 1rem;
                }
                .logs-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .logs-table th, .logs-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .logs-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #666;
                }
                .badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    text-transform: capitalize;
                }
                .badge.user_login { background: #e3f2fd; color: #1565c0; }
                .badge.case_submitted { background: #ffebee; color: #c62828; }
                .badge.intervention_added { background: #e8f5e9; color: #2e7d32; }
            `}</style>
        </div>
    );
}

export default AdminDashboard;
