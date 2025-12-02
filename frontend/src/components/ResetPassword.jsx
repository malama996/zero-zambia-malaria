import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function ResetPassword() {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('input'); // input, submitting, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setStatus('submitting');
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid reset link.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, {
                password
            });
            setStatus('success');
            setMessage(response.data.message);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Failed to reset password.');
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2>Reset Password</h2>

                {status === 'success' ? (
                    <div className="success-view">
                        <div className="icon">✅</div>
                        <p>{message}</p>
                        <button
                            className="btn-submit"
                            onClick={() => window.location.href = '/'}
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="reset-form">
                        {message && <div className={`message ${status === 'error' ? 'error' : ''}`}>{message}</div>}

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>

            <style>{`
                .reset-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    padding: 2rem;
                }
                .reset-card {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 147, 213, 0.15);
                    max-width: 400px;
                    width: 100%;
                }
                h2 {
                    color: var(--who-blue);
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #333;
                }
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #E0E0E0;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                .btn-submit {
                    width: 100%;
                    padding: 0.75rem;
                    background: var(--who-blue);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                }
                .btn-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .message {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    background: #f0f0f0;
                    color: #333;
                }
                .message.error {
                    background: #FEE;
                    color: #DE2010;
                }
                .success-view {
                    text-align: center;
                }
                .icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
}

export default ResetPassword;
