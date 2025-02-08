// NewsDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { database } from '../../../Firebase';
import { ref, onValue } from 'firebase/database';
import './NewsDetailPage.scss';

interface NewsItem {
    imageUrl: string;
    title: string;
    text: string;
    date: string;
    source: string;
}

const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleBackToBlog = () => {
        navigate('/blog'); // Navigate to the Blog page
    };

    useEffect(() => {
        if (id) {
            const newsRef = ref(database, `news/${id}`);
            onValue(newsRef, (snapshot) => {
                if (snapshot.exists()) {
                    setNewsItem(snapshot.val());
                    setLoading(false);
                } else {
                    setError('Новость не найдена');
                    setLoading(false);
                }
            }, (error) => {
                setError(error.message);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!newsItem) {
        return <div>News not found</div>;
    }

    // Function to linkify text and images
    const linkifyAndBold = (text: string): string => {
        const urlRegex = /((?:https?:\/\/)|(?:www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
        const imageExtensions = ['.jpg', '.png', '.webp', '.jpeg', '.gif'];
        return text.replace(urlRegex, (url) => {
            const href = url.startsWith('http') ? url : `http://${url}`;
            const isImage = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
            if (isImage) {
                return `<img src="${href}" alt=${newsItem.title} />`;
            } else {
                return url; // Просто возвращаем найденный URL без изменений, как обычный текст
            }
        });
    };

    return (
        <div className="news-detail-page">
            <div className="breadcrumbs"><span onClick={handleBackToBlog}>Blog</span> / {newsItem.title}</div>
            <h1 className="news-title">{newsItem.title}</h1>
            <img className="news-image" src={newsItem.imageUrl} alt={newsItem.title} />
            <div className="news-content" dangerouslySetInnerHTML={{ __html: linkifyAndBold(newsItem.text) }} />
            <div className="news-source">
                Source: <a href={newsItem.source} target="_blank" rel="noopener noreferrer">{newsItem.source.split('/')[2]}</a>
            </div>
            <div className="news-date">{new Date(newsItem.date).toLocaleString()}</div>
        </div>
    );
};

export default NewsDetailPage;