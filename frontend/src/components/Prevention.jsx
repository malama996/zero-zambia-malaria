import React from 'react';
import { useTranslation } from 'react-i18next';

function Prevention() {
    const { t } = useTranslation();

    const preventionMethods = [
        {
            id: 1,
            icon: '🛏️',
            title: t('prevention.nets.title'),
            description: t('prevention.nets.desc'),
            tips: [
                t('prevention.nets.tip1'),
                t('prevention.nets.tip2'),
                t('prevention.nets.tip3')
            ]
        },
        {
            id: 2,
            icon: '💉',
            title: t('prevention.spray.title'),
            description: t('prevention.spray.desc'),
            tips: [
                t('prevention.spray.tip1'),
                t('prevention.spray.tip2'),
                t('prevention.spray.tip3')
            ]
        },
        {
            id: 3,
            icon: '👕',
            title: t('prevention.clothing.title'),
            description: t('prevention.clothing.desc'),
            tips: [
                t('prevention.clothing.tip1'),
                t('prevention.clothing.tip2'),
                t('prevention.clothing.tip3')
            ]
        },
        {
            id: 4,
            icon: '🏡',
            title: t('prevention.environment.title'),
            description: t('prevention.environment.desc'),
            tips: [
                t('prevention.environment.tip1'),
                t('prevention.environment.tip2'),
                t('prevention.environment.tip3')
            ]
        }
    ];

    const symptoms = [
        { icon: '🤒', text: t('prevention.symptoms.fever') },
        { icon: '😰', text: t('prevention.symptoms.sweating') },
        { icon: '🥶', text: t('prevention.symptoms.chills') },
        { icon: '🤕', text: t('prevention.symptoms.headache') },
        { icon: '🤢', text: t('prevention.symptoms.nausea') },
        { icon: '😫', text: t('prevention.symptoms.fatigue') },
        { icon: '💪', text: t('prevention.symptoms.bodyPain') },
        { icon: '🤮', text: t('prevention.symptoms.vomiting') }
    ];

    return (
        <div className="prevention-page">
            <div className="page-header prevention-header">
                <h2 className="page-title">🛡️ {t('prevention.pageTitle')}</h2>
                <p className="page-subtitle">{t('prevention.pageSubtitle')}</p>
            </div>

            {/* Prevention Methods */}
            <div className="prevention-grid">
                {preventionMethods.map(method => (
                    <div key={method.id} className="prevention-card card">
                        <div className="prevention-icon">{method.icon}</div>
                        <h3 className="prevention-title">{method.title}</h3>
                        <p className="prevention-desc">{method.description}</p>
                        <ul className="prevention-tips">
                            {method.tips.map((tip, index) => (
                                <li key={index}>✓ {tip}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Symptoms Section */}
            <div className="symptoms-section card">
                <h3 className="section-heading">⚠️ {t('prevention.symptomsTitle')}</h3>
                <p className="symptoms-intro">{t('prevention.symptomsIntro')}</p>
                <div className="symptoms-grid">
                    {symptoms.map((symptom, index) => (
                        <div key={index} className="symptom-item">
                            <span className="symptom-icon">{symptom.icon}</span>
                            <span className="symptom-text">{symptom.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="emergency-card card">
                <h3 className="emergency-title">🚨 {t('prevention.emergencyTitle')}</h3>
                <p className="emergency-text">{t('prevention.emergencyText')}</p>
                <div className="emergency-contacts">
                    <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        <div>
                            <strong>{t('prevention.emergency')}</strong>
                            <p>991 / 992</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon">🏥</span>
                        <div>
                            <strong>{t('prevention.healthHotline')}</strong>
                            <p>909</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon">📱</span>
                        <div>
                            <strong>{t('prevention.smsReporting')}</strong>
                            <p>+260 XXX XXXXX</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action CTA */}
            <div className="action-cta card">
                <h3>💪 {t('prevention.takeAction')}</h3>
                <p>{t('prevention.ctaText')}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="btn-submit"
                        style={{ flex: 1, minWidth: '200px' }}
                    >
                        {t('prevention.learnMore')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Prevention;
