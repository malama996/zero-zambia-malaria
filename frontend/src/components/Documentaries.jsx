import React from 'react';
import { useTranslation } from 'react-i18next';

function Documentaries() {
    const { t } = useTranslation();

    const documentaries = [
        {
            id: 1,
            category: 'Zambia Health Ministry',
            title: t('documentaries.zambiaVaccine.title'),
            description: t('documentaries.zambiaVaccine.desc'),
            videoId: 'ErTYIBZX1JI', // Zambia Malaria Vaccine Launch
            duration: '3:45'
        },
        {
            id: 2,
            category: 'Community Awareness',
            title: t('documentaries.communityVideo.title'),
            description: t('documentaries.communityVideo.desc'),
            videoId: 'WYS5qRYjM2k', // Community Sensitization Zambia NMEC
            duration: '5:12'
        },
        {
            id: 3,
            category: 'Zambia Health Ministry',
            title: t('documentaries.ministerMessage.title'),
            description: t('documentaries.ministerMessage.desc'),
            videoId: 'PoDN2j3eMEo', // Minister on Malaria in Zambia
            duration: '4:30'
        },
        {
            id: 4,
            category: 'Data & Innovation',
            title: t('documentaries.dataVisualization.title'),
            description: t('documentaries.dataVisualization.desc'),
            videoId: 'YourVideoID', // Visualize No Malaria - Zambia
            duration: '6:20'
        },
        {
            id: 5,
            category: 'Prevention Methods',
            title: t('documentaries.prevention.title'),
            description: t('documentaries.prevention.desc'),
            videoId: 'OTsBB7CqXmc', // Malaria prevention general
            duration: '4:12'
        },
        {
            id: 6,
            category: 'Understanding Malaria',
            title: t('documentaries.understanding.title'),
            description: t('documentaries.understanding.desc'),
            videoId: 'j6CbvIRA8qo', // WHO Malaria video
            duration: '3:24'
        },
        {
            id: 7,
            category: 'Treatment & Care',
            title: t('documentaries.treatment.title'),
            description: t('documentaries.treatment.desc'),
            videoId: '8MwKkqJ6zCo', // Malaria treatment
            duration: '5:30'
        },
        {
            id: 8,
            category: 'Community Action',
            title: t('documentaries.community.title'),
            description: t('documentaries.community.desc'),
            videoId: 'Hkv_9TO_q6U', // Zero Malaria Starts with Me
            duration: '2:45'
        }
    ];

    const categories = [
        'Zambia Health Ministry',
        'Community Awareness',
        'Data & Innovation',
        'Prevention Methods',
        'Understanding Malaria',
        'Treatment & Care',
        'Community Action'
    ];

    return (
        <div className="documentaries-page">
            <div className="page-header">
                <h2 className="page-title">🎥 {t('documentaries.pageTitle')}</h2>
                <p className="page-subtitle">{t('documentaries.pageSubtitle')}</p>
            </div>

            {categories.map(category => {
                const categoryDocs = documentaries.filter(doc => doc.category === category);
                if (categoryDocs.length === 0) return null;

                return (
                    <div key={category} className="documentary-category">
                        <h3 className="category-title">{category}</h3>
                        <div className="video-grid">
                            {categoryDocs.map(doc => (
                                <div key={doc.id} className="video-card">
                                    <div className="video-wrapper">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${doc.videoId}`}
                                            title={doc.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="video-iframe"
                                        ></iframe>
                                    </div>
                                    <div className="video-info">
                                        <h4 className="video-title">{doc.title}</h4>
                                        <p className="video-description">{doc.description}</p>
                                        <span className="video-duration">⏱️ {doc.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            <div className="documentary-cta card">
                <h3>📚 {t('documentaries.learnMore')}</h3>
                <p>{t('documentaries.ctaText')}</p>
                <a
                    href="https://www.afro.who.int/health-topics/malaria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-submit"
                    style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}
                >
                    {t('documentaries.visitWHO')}
                </a>
            </div>
        </div>
    );
}

export default Documentaries;
