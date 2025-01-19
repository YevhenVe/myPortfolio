// NewsDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
        const boldRegex = /=b(.*?)=\/b/gs; // Use *? for non-greedy matching, /s for . to match newline
        const imageExtensions = ['.jpg', '.png', '.webp', '.jpeg', '.gif'];

        // First, handle Bold formatting
        text = text.replace(boldRegex, (match, capturedText) => `<b>${capturedText.trim()}</b>`);

        // Then, handle links and images (after bolding)
        text = text.replace(urlRegex, (url) => {
            const href = url.startsWith('http') ? url : `http://${url}`;
            const displayUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

            const isImage = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));

            if (isImage) {
                return `<img class="added-news-image" src="${href}" alt="${displayUrl}" style="max-width: 100%; height: auto;" />`;
            } else {
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${displayUrl}</a>`;
            }
        });

        return text;
    };

    return (
        <div className="news-detail-page">
            <div className="breadcrumbs"><span onClick={() => window.history.back()}>Blog</span> / {newsItem.title}</div>
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