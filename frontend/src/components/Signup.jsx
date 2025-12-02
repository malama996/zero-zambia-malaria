import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

function Signup({ onSuccess, onSwitchToLogin }) {
    const { t } = useTranslation();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        facility: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.role === 'health_professional' && !formData.facility) {
            setError('Facility is required for health professionals');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...signupData } = formData;
        const result = await signup(signupData);

        if (result.success) {
            if (onSuccess) onSuccess();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>📝 {t('auth.signup.title') || 'Create Account'}</h2>
                    <p>{t('auth.signup.subtitle') || 'Join the fight against malaria'}</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">{t('auth.name') || 'Full Name'}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">{t('auth.email') || 'Email'}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">{t('auth.role') || 'I am a...'}</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="user">{t('auth.roles.user') || 'Community Member'}</option>
                            <option value="health_professional">{t('auth.roles.healthProfessional') || 'Health Professional'}</option>
                        </select>
                    </div>

                    {formData.role === 'health_professional' && (
                        <div className="form-group">
                            <label htmlFor="facility">{t('auth.facility') || 'Health Facility'}</label>
                            <input
                                type="text"
                                id="facility"
                                name="facility"
                                value={formData.facility}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Lusaka General Hospital"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="phone">{t('auth.phone') || 'Phone Number (Optional)'}</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+260 XXX XXX XXX"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{t('auth.password') || 'Password'}</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">{t('auth.confirmPassword') || 'Confirm Password'}</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? t('auth.signingUp') || 'Creating account...' : t('auth.signup.button') || 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {t('auth.hasAccount') || 'Already have an account?'}{' '}
                        <button onClick={onSwitchToLogin} className="link-button">
                            {t('auth.login.button') || 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
