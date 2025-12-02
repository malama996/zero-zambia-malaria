import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function VerifyEmail() {
    const { t } = useTranslation();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (!token) {
                setStatus('error');
                setMessage('No verification token found.');
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed. Token may be invalid or expired.');
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className="verify-container">
            <div className="verify-card">
                <div className="verify-icon">
                    {status === 'verifying' && '⏳'}
                    {status === 'success' && '✅'}
                    {status === 'error' && '❌'}
                </div>
                <h2>
                    {status === 'verifying' && 'Verifying Email...'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h2>
                <p>{message}</p>

                {status !== 'verifying' && (
                    <button
                        className="btn-login"
                        onClick={() => window.location.href = '/'}
                    >
                        Go to Login
                    </button>
                )}
            </div>

            <style>{`
                .verify-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    padding: 2rem;
                }
                .verify-card {
                    background: white;
                    padding: 3rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 147, 213, 0.15);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                }
                .verify-icon {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                }
                h2 {
                    color: var(--who-blue);
                    margin-bottom: 1rem;
                }
                p {
                    color: #666;
                    margin-bottom: 2rem;
                }
                .btn-login {
                    background: var(--who-blue);
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .btn-login:hover {
                    background: var(--who-blue-dark);
                }
            `}</style>
        </div>
    );
}

export default VerifyEmail;
