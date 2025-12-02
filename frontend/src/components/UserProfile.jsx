import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function UserProfile() {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(user?.notificationPreferences || { emailNotifications: true, smsNotifications: false });
    const [message, setMessage] = useState('');

    const handleNotificationChange = async (type) => {
        const newPrefs = {
            ...notifications,
            [type]: !notifications[type]
        };
        setNotifications(newPrefs);

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/auth/notification-preferences`,
                newPrefs,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Preferences updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update preferences', error);
            setMessage('Failed to update preferences');
        }
    };

    if (!user) return <div>Please login to view profile.</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>User Profile</h1>
                <button className="btn-logout" onClick={logout}>Logout</button>
            </div>

            <div className="profile-card">
                <div className="profile-section">
                    <h3>Personal Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Name</label>
                            <p>{user.name}</p>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <p>{user.email}</p>
                        </div>
                        <div className="info-item">
                            <label>Role</label>
                            <p className="role-badge">{user.role.replace('_', ' ')}</p>
                        </div>
                        {user.facility && (
                            <div className="info-item">
                                <label>Facility</label>
                                <p>{user.facility}</p>
                            </div>
                        )}
                        <div className="info-item">
                            <label>Status</label>
                            <p className={user.isEmailVerified ? 'verified' : 'unverified'}>
                                {user.isEmailVerified ? '✅ Verified' : '⚠️ Unverified'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Notification Preferences</h3>
                    {message && <div className="message">{message}</div>}
                    <div className="toggle-list">
                        <div className="toggle-item">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={notifications.emailNotifications}
                                    onChange={() => handleNotificationChange('emailNotifications')}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span>Email Notifications</span>
                        </div>
                        {/* SMS Notifications placeholder - waiting for backend integration */}
                        <div className="toggle-item disabled">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={notifications.smsNotifications}
                                    disabled
                                />
                                <span className="slider round"></span>
                            </label>
                            <span>SMS Notifications (Coming Soon)</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .profile-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .profile-header h1 {
                    color: var(--who-blue);
                    margin: 0;
                }
                .btn-logout {
                    background: #DE2010;
                    color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .profile-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    overflow: hidden;
                }
                .profile-section {
                    padding: 2rem;
                    border-bottom: 1px solid #eee;
                }
                .profile-section:last-child {
                    border-bottom: none;
                }
                h3 {
                    color: #333;
                    margin-bottom: 1.5rem;
                    font-size: 1.2rem;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
                .info-item label {
                    display: block;
                    font-size: 0.85rem;
                    color: #666;
                    margin-bottom: 0.25rem;
                }
                .info-item p {
                    font-weight: 500;
                    color: #333;
                    font-size: 1.1rem;
                }
                .role-badge {
                    display: inline-block;
                    background: #e3f2fd;
                    color: var(--who-blue);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.9rem !important;
                    text-transform: capitalize;
                }
                .verified { color: #198A00 !important; }
                .unverified { color: #DE2010 !important; }
                
                .toggle-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .toggle-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .toggle-item.disabled {
                    opacity: 0.5;
                }
                
                /* Switch styles */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 28px;
                }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 20px;
                    width: 20px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }
                input:checked + .slider { background-color: var(--who-blue); }
                input:checked + .slider:before { transform: translateX(22px); }
                .slider.round { border-radius: 34px; }
                .slider.round:before { border-radius: 50%; }
                
                .message {
                    background: #e8f5e9;
                    color: #2e7d32;
                    padding: 0.75rem;
                    border-radius: 6px;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
}

export default UserProfile;
