import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function News() {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mock news data
    const newsArticles = [
        {
            id: 1,
            category: 'malaria',
            title: t('news.article1.title'),
            summary: t('news.article1.summary'),
            source: 'Ministry of Health Zambia',
            date: '2025-11-20',
            image: '🦟',
            link: '#'
        },
        {
            id: 2,
            category: 'health',
            title: t('news.article2.title'),
            summary: t('news.article2.summary'),
            source: 'WHO Africa',
            date: '2025-11-18',
            image: '💉',
            link: '#'
        },
        {
            id: 3,
            category: 'sanitation',
            title: t('news.article3.title'),
            summary: t('news.article3.summary'),
            source: 'Zambia Environmental Management',
            date: '2025-11-15',
            image: '💧',
            link: '#'
        },
        {
            id: 4,
            category: 'malaria',
            title: t('news.article4.title'),
            summary: t('news.article4.summary'),
            source: 'Zero Malaria Zambia',
            date: '2025-11-12',
            image: '🛏️',
            link: '#'
        },
        {
            id: 5,
            category: 'community',
            title: t('news.article5.title'),
            summary: t('news.article5.summary'),
            source: 'Community Health Workers Association',
            date: '2025-11-10',
            image: '👥',
            link: '#'
        },
        {
            id: 6,
            category: 'health',
            title: t('news.article6.title'),
            summary: t('news.article6.summary'),
            source: 'National Health Research Authority',
            date: '2025-11-08',
            image: '🔬',
            link: '#'
        },
        {
            id: 7,
            category: 'sanitation',
            title: t('news.article7.title'),
            summary: t('news.article7.summary'),
            source: 'Ministry of Water & Sanitation',
            date: '2025-11-05',
            image: '🚰',
            link: '#'
        },
        {
            id: 8,
            category: 'malaria',
            title: t('news.article8.title'),
            summary: t('news.article8.summary'),
            source: 'WHO',
            date: '2025-11-01',
            image: '🌍',
            link: '#'
        }
    ];

    const categories = [
        { value: 'all', label: t('news.allNews'), icon: '📰' },
        { value: 'malaria', label: t('news.malariaUpdates'), icon: '🦟' },
        { value: 'health', label: t('news.healthAdvisories'), icon: '⚕️' },
        { value: 'sanitation', label: t('news.sanitation'), icon: '💧' },
        { value: 'community', label: t('news.communityHealth'), icon: '👥' }
    ];

    const filteredNews = selectedCategory === 'all'
        ? newsArticles
        : newsArticles.filter(article => article.category === selectedCategory);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return t('news.today');
        if (diffDays === 1) return t('news.yesterday');
        if (diffDays < 7) return `${diffDays} ${t('news.daysAgo')}`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${t('news.weeksAgo')}`;
        return date.toLocaleDateString();
    };

    return (
        <div className="news-page">
            <div className="page-header">
                <h2 className="page-title">📰 {t('news.pageTitle')}</h2>
                <p className="page-subtitle">{t('news.pageSubtitle')}</p>
            </div>

            {/* Category Filter */}
            <div className="news-categories">
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.value)}
                    >
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-label">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* News Grid */}
            <div className="news-grid">
                {filteredNews.map(article => (
                    <article key={article.id} className="news-card card">
                        <div className="news-image">
                            <div className="news-emoji">{article.image}</div>
                        </div>
                        <div className="news-content">
                            <div className="news-meta">
                                <span className="news-source">{article.source}</span>
                                <span className="news-date">{formatDate(article.date)}</span>
                            </div>
                            <h3 className="news-title">{article.title}</h3>
                            <p className="news-summary">{article.summary}</p>
                            <a
                                href={article.link}
                                className="news-read-more"
                                onClick={(e) => {
                                    if (article.link === '#') {
                                        e.preventDefault();
                                        alert(t('news.comingSoon'));
                                    }
                                }}
                            >
                                {t('news.readMore')} →
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            {/* Featured Alert */}
            <div className="featured-alert card">
                <h3>🔔 {t('news.stayInformed')}</h3>
                <p>{t('news.alertText')}</p>
                <button className="btn-submit">
                    {t('news.subscribe')}
                </button>
            </div>

            {/* Resources Section */}
            <div className="news-resources card">
                <h3>🔗 {t('news.usefulLinks')}</h3>
                <ul className="resource-links">
                    <li>
                        <a href="https://www.afro.who.int/countries/zambia" target="_blank" rel="noopener noreferrer">
                            🌍 WHO Zambia
                        </a>
                    </li>
                    <li>
                        <a href="https://www.moh.gov.zm" target="_blank" rel="noopener noreferrer">
                            🏥 Ministry of Health Zambia
                        </a>
                    </li>
                    <li>
                        <a href="https://endmalaria.org" target="_blank" rel="noopener noreferrer">
                            🦟 RBM Partnership to End Malaria
                        </a>
                    </li>
                    <li>
                        <a href="https://www.afro.who.int/health-topics/malaria" target="_blank" rel="noopener noreferrer">
                            📚 Malaria Resources - WHO Africa
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default News;
