import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer({ setActiveTab }) {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-heading">🦟 {t('appTitle')}</h3>
                    <p className="footer-text">
                        {t('footer.mission')}
                    </p>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">{t('footer.quickLinks')}</h3>
                    <ul className="footer-links">
                        <li>
                            <button onClick={() => setActiveTab('submit')} className="footer-link-btn">
                                {t('nav.submit')}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('map')} className="footer-link-btn">
                                {t('nav.map')}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('prevention')} className="footer-link-btn">
                                {t('nav.prevention')}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('hospitals')} className="footer-link-btn">
                                {t('nav.hospitals')}
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">{t('footer.resources')}</h3>
                    <ul className="footer-links">
                        <li>
                            <button onClick={() => setActiveTab('documentaries')} className="footer-link-btn">
                                {t('nav.documentaries')}
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('news')} className="footer-link-btn">
                                {t('nav.news')}
                            </button>
                        </li>
                        <li>
                            <a href="https://www.afro.who.int/health-topics/malaria" target="_blank" rel="noopener noreferrer" className="footer-link-btn">
                                WHO Malaria Info
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">{t('footer.contact')}</h3>
                    <p className="footer-text">
                        📞 Emergency: 991 / 992<br />
                        📧 info@zeromalariazmb.org<br />
                        🌐 Zero Malaria Zambia
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="footer-copyright">
                    © {currentYear} {t('footer.copyright')} | {t('footer.builtWith')} ❤️ {t('footer.forZambia')}
                </p>
                <div className="footer-social">
                    <a href="#" className="social-link" aria-label="Facebook">📘</a>
                    <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                    <a href="#" className="social-link" aria-label="Instagram">📷</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
