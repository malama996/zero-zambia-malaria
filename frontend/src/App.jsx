import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CaseForm from './components/CaseForm';
import Map from './components/Map';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';
import Documentaries from './components/Documentaries';
import Prevention from './components/Prevention';
import Hospitals from './components/Hospitals';
import News from './components/News';
import Login from './components/Login';
import Signup from './components/Signup';
import HealthDashboard from './components/HealthDashboard';
import VerifyEmail from './components/VerifyEmail';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
    const { t } = useTranslation();
    const { isAuthenticated, isHealthProfessional, user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('submit');
    const [showWelcome, setShowWelcome] = useState(false);
    const [authMode, setAuthMode] = useState(null); // 'login' or 'signup'

    useEffect(() => {
        // Handle URL-based routing for email links
        const path = window.location.pathname;
        if (path === '/verify-email') {
            setActiveTab('verify-email');
        } else if (path === '/reset-password') {
            setActiveTab('reset-password');
        } else {
            // Show welcome on first visit only if not following a special link
            const hasVisited = localStorage.getItem('hasVisited');
            if (!hasVisited) {
                setShowWelcome(true);
                localStorage.setItem('hasVisited', 'true');
            }
        }
    }, []);

    // Redirect health professionals to dashboard on login
    useEffect(() => {
        if (isAuthenticated && isHealthProfessional && activeTab === 'submit') {
            setActiveTab('health-dashboard');
        }
    }, [isAuthenticated, isHealthProfessional]);

    const handleAuthSuccess = () => {
        setAuthMode(null);
        if (isHealthProfessional) {
            setActiveTab('health-dashboard');
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: 'var(--who-blue)'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <>
            {showWelcome && <Welcome onClose={() => setShowWelcome(false)} />}
            <div className="app-wrapper">
                <Navbar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onHelpClick={() => setShowWelcome(true)}
                    onLoginClick={() => setAuthMode('login')}
                    onSignupClick={() => setAuthMode('signup')}
                    onProfileClick={() => setActiveTab('profile')}
                />

                <main className="main-content-new">
                    {authMode === 'login' && (
                        <Login
                            onSuccess={handleAuthSuccess}
                            onSwitchToSignup={() => setAuthMode('signup')}
                        />
                    )}
                    {authMode === 'signup' && (
                        <Signup
                            onSuccess={handleAuthSuccess}
                            onSwitchToLogin={() => setAuthMode('login')}
                        />
                    )}
                    {!authMode && (
                        <>
                            {activeTab === 'submit' && <CaseForm />}
                            {activeTab === 'map' && <Map />}
                            {activeTab === 'dashboard' && <Dashboard />}
                            {activeTab === 'documentaries' && <Documentaries />}
                            {activeTab === 'prevention' && <Prevention />}
                            {activeTab === 'hospitals' && <Hospitals />}
                            {activeTab === 'news' && <News />}
                            {activeTab === 'health-dashboard' && isHealthProfessional && <HealthDashboard />}
                            {activeTab === 'verify-email' && <VerifyEmail />}
                            {activeTab === 'reset-password' && <ResetPassword />}
                            {activeTab === 'profile' && <UserProfile />}
                            {activeTab === 'admin-dashboard' && (user?.role === 'admin' || user?.role === 'health_professional') && <AdminDashboard />}
                        </>
                    )}
                </main>

                <Footer setActiveTab={setActiveTab} />
            </div>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
