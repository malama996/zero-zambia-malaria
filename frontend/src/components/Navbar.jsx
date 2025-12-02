import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function Navbar({ activeTab, setActiveTab, onHelpClick, onLoginClick, onSignupClick }) {
    const { t, i18n } = useTranslation();
    const { isAuthenticated, user, isHealthProfessional, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleLearnDropdown = (e) => {
        e.stopPropagation();
        setIsLearnDropdownOpen(!isLearnDropdownOpen);
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleNavClick = (tab) => {
        setActiveTab(tab);
        setIsMenuOpen(false);
        setIsLearnDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        setActiveTab('submit');
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Official Top Bar */}
            <div style={{ background: '#0093D5', padding: '0.5rem 1rem', color: 'white', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>Republic of Zambia Ministry of Health</span>
                    <span>|</span>
                    <span>World Health Organization</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ width: '20px', height: '12px', background: '#198A00' }}></div>
                    <div style={{ width: '20px', height: '12px', background: '#DE2010' }}></div>
                    <div style={{ width: '20px', height: '12px', background: '#000000' }}></div>
                    <div style={{ width: '20px', height: '12px', background: '#EF7D00' }}></div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-brand" onClick={() => handleNavClick('submit')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* MOH Logo Placeholder */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #198A00',
                                color: '#198A00',
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                textAlign: 'center',
                                lineHeight: '1'
                            }}>
                                MOH
                            </div>

                            {/* WHO Logo Placeholder */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #0093D5',
                                color: '#0093D5',
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                textAlign: 'center',
                                lineHeight: '1'
                            }}>
                                WHO
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h1 className="navbar-title">{t('appTitle')}</h1>
                                <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 300 }}>National Malaria Elimination Centre</span>
                            </div>
                        </div>
                    </div>

                    <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>

                    <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                        <button
                            className={`nav-link ${activeTab === 'submit' ? 'active' : ''}`}
                            onClick={() => handleNavClick('submit')}
                        >
                            {t('nav.submit')}
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'map' ? 'active' : ''}`}
                            onClick={() => handleNavClick('map')}
                        >
                            {t('nav.map')}
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleNavClick('dashboard')}
                        >
                            {t('nav.dashboard')}
                        </button>

                        {isHealthProfessional && (
                            <button
                                className={`nav-link ${activeTab === 'health-dashboard' ? 'active' : ''}`}
                                onClick={() => handleNavClick('health-dashboard')}
                            >
                                🏥 Health Dashboard
                            </button>
                        )}

                        <div className="nav-dropdown">
                            <button
                                className={`nav-link dropdown-toggle ${['documentaries', 'prevention'].includes(activeTab) ? 'active' : ''}`}
                                onClick={toggleLearnDropdown}
                            >
                                {t('nav.learn')} <span className="dropdown-arrow">▼</span>
                            </button>
                            <div className={`dropdown-menu ${isLearnDropdownOpen ? 'show' : ''}`}>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleNavClick('documentaries')}
                                >
                                    {t('nav.documentaries')}
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleNavClick('prevention')}
                                >
                                    {t('nav.prevention')}
                                </button>
                            </div>
                        </div>

                        <button
                            className={`nav-link ${activeTab === 'hospitals' ? 'active' : ''}`}
                            onClick={() => handleNavClick('hospitals')}
                        >
                            {t('nav.hospitals')}
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'news' ? 'active' : ''}`}
                            onClick={() => handleNavClick('news')}
                        >
                            {t('nav.news')}
                        </button>

                        <div className="navbar-controls">
                            <select className="lang-select-nav" onChange={changeLanguage} defaultValue={i18n.language}>
                                <option value="en">English</option>
                                <option value="bem">Icibemba</option>
                                <option value="nya">Cinyanja</option>
                                <option value="to">Chitonga</option>
                                <option value="loz">Silozi</option>
                                <option value="lun">Lunda</option>
                                <option value="luv">Luvale</option>
                                <option value="kqn">Kiikaonde</option>
                            </select>

                            {isAuthenticated ? (
                                <div className="user-menu">
                                    <div className="user-dropdown">
                                        <button className="user-btn">
                                            👤 {user?.name} ▼
                                        </button>
                                        <div className="user-dropdown-content">
                                            <button onClick={() => handleNavClick('profile')}>
                                                Profile
                                            </button>
                                            {(user?.role === 'admin' || user?.role === 'health_professional') && (
                                                <button onClick={() => handleNavClick('admin-dashboard')}>
                                                    Admin Dashboard
                                                </button>
                                            )}
                                            <button onClick={handleLogout} className="logout-item">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <button className="login-btn" onClick={onLoginClick}>
                                        Login
                                    </button>
                                    <button className="signup-btn" onClick={onSignupClick}>
                                        Sign Up
                                    </button>
                                </div>
                            )}

                            <button className="help-btn-nav" onClick={onHelpClick}>
                                {t('help')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <style>{`
                .user-menu {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .user-name {
                    color: var(--who-blue);
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .logout-btn {
                    padding: 0.5rem 1rem;
                    background: #DE2010;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.3s;
                }

                .logout-btn:hover {
                    background: #B01808;
                }

                .auth-buttons {
                    display: flex;
                    gap: 0.5rem;
                }

                .login-btn, .signup-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .login-btn {
                    background: white;
                    color: var(--who-blue);
                    border: 2px solid var(--who-blue);
                }

                .login-btn:hover {
                    background: var(--who-blue);
                    color: white;
                }

                .signup-btn {
                    background: var(--who-blue);
                    color: white;
                }

                .signup-btn:hover {
                    background: var(--who-blue-dark);
                }

                @media (max-width: 768px) {
                    .user-menu, .auth-buttons {
                        flex-direction: column;
                        width: 100%;
                    }

                    .user-name {
                        text-align: center;
                    }

                    .logout-btn, .login-btn, .signup-btn {
                        width: 100%;
                    }
                    
                    .user-dropdown {
                        width: 100%;
                    }
                    
                    .user-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .user-dropdown-content {
                        position: static;
                        box-shadow: none;
                        border: 1px solid #eee;
                        width: 100%;
                    }
                }

                .user-dropdown {
                    position: relative;
                    display: inline-block;
                }

                .user-btn {
                    background: none;
                    border: none;
                    color: var(--who-blue);
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                }

                .user-dropdown-content {
                    display: none;
                    position: absolute;
                    right: 0;
                    background-color: white;
                    min-width: 160px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    z-index: 1;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .user-dropdown:hover .user-dropdown-content {
                    display: block;
                }

                .user-dropdown-content button {
                    color: black;
                    padding: 12px 16px;
                    text-decoration: none;
                    display: block;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                .user-dropdown-content button:hover {
                    background-color: #f1f1f1;
                    color: var(--who-blue);
                }
                
                .logout-item {
                    color: #DE2010 !important;
                    border-top: 1px solid #eee !important;
                }
                
                .logout-item:hover {
                    background-color: #ffebee !important;
                }
            `}</style>
        </>
    );
}

export default Navbar;
