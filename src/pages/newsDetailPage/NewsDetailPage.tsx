import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../../../Firebase';
import { ref, onValue } from 'firebase/database';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'; // Убедитесь, что путь к RootState правильный
import './NewsDetailPage.scss';

interface NewsItem {
    imageUrl: string;
    title: string;
    text: string;
    date: string;
    source: string;
    forAdmin?: boolean; // Убедимся, что forAdmin есть в типе
}

const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Получаем пользователя из Redux store
    const user = useSelector((state: RootState) => state.user);

    const handleBackToBlog = () => {
        navigate('/blog'); // Navigate to the Blog page
    };

    useEffect(() => {
        if (id) {
            const newsRef = ref(database, `news/${id}`);
            // Используем onValue, чтобы получать обновления, если новость изменится
            const unsubscribe = onValue(newsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const newsItemData: NewsItem = snapshot.val(); // Получаем данные новости

                    // !!! ГЛАВНАЯ ПРОВЕРКА БЕЗОПАСНОСТИ !!!
                    // Если новость только для админов И текущий пользователь НЕ админ
                    if (newsItemData.forAdmin && user.role !== 'admin') {
                        console.warn(`Attempted access to admin-only news item: ${id} by user role: ${user.role}`);
                        setLoading(false); // Останавливаем состояние загрузки
                        // Перенаправляем на 404 или другую страницу, чтобы скрыть существование новости
                        navigate('/404');
                    } else {
                        // Доступ разрешен (либо новость не для админов, либо пользователь - админ)
                        setNewsItem(newsItemData);
                        setLoading(false);
                    }
                } else {
                    // Новость не найдена по ID
                    setLoading(false); // Останавливаем состояние загрузки
                    // Перенаправляем на 404
                    navigate('/404');
                }
            }, (error) => {
                // Ошибка при чтении из Firebase (например, права доступа на уровне базы данных)
                console.error("Firebase read error:", error);
                setError(error.message); // Можно показать ошибку, но перенаправление на 404 тоже вариант
                setLoading(false);
            });

            // Очищаем слушатель при размонтировании компонента или изменении id/user
            return () => unsubscribe();

        } else {
            // Если ID новости отсутствует в URL
            setLoading(false);
            navigate('/404'); // Перенаправляем на 404
        }
    }, [id, user, navigate]); // Добавляем user и navigate в зависимости useEffect

    // Отображаем состояние загрузки или ошибки
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Если newsItem все еще null на этом этапе, это означает, что useEffect уже вызвал navigate('/404')
    // Можно вернуть null или заглушку.
    if (!newsItem) {
        return null; // Компонент будет пустой, пока navigate не отработает
    }


    // Функция linkifyAndBold остается без изменений
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

    // JSX для отображения новости (остается без изменений, кроме использования newsItem)
    return (
        <div className="news-detail-page">
            <div className="breadcrumbs"><span onClick={handleBackToBlog}>Blog</span> / {newsItem.title}</div>
            <h1 className="news-title">{newsItem.title}</h1>
            <img className="news-image" src={newsItem.imageUrl} alt={newsItem.title} />
            {/* Опасно использовать dangerouslySetInnerHTML, убедитесь, что текст новости безопасен или проходит санитайзинг */}
            <div className="news-content" dangerouslySetInnerHTML={{ __html: linkifyAndBold(newsItem.text) }} />
            <div className="news-source">
                Source: <a href={newsItem.source} target="_blank" rel="noopener noreferrer">{newsItem.source.split('/')[2]}</a>
            </div>
            <div className="news-date">{new Date(newsItem.date).toLocaleString()}</div>
        </div>
    );
};

export default NewsDetailPage;