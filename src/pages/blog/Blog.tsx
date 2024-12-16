import React, { useState, useEffect, useCallback } from "react";
import { database } from "../../../Firebase";
import { ref, query, orderByChild, onValue, remove, push } from "firebase/database";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from 'react-toastify';
import Button from "../../components/button/Button";
import "./Blog.scss";

interface NewsItem {
    id: string;
    imageUrl: string;
    title: string;
    text: string;
    date: string;
    source: string;
    notify: string;
    forAdmin: boolean;
}

const Blog: React.FC = () => {
    const [imageUrl, setImageUrl] = useState("");
    const [newsTitle, setNewsTitle] = useState("");
    const [newsText, setNewsText] = useState("");
    const [sourceLink, setSourceLink] = useState("");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [visibleNews, setVisibleNews] = useState<NewsItem[]>([]);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [forAdmin, setForAdmin] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const postsPerPage = 5;
    const notify = (message: string, type: "success" | "error" = "success") => toast(message, { type });

    // Add news to Firebase
    const addNews = async () => {
        if (!imageUrl || !newsTitle || !newsText || !sourceLink) return;
        try {
            const newsRef = ref(database, "news");
            const currentDate = new Date().toISOString();
            await push(newsRef, {
                imageUrl,
                title: newsTitle,
                text: newsText,
                date: currentDate,
                source: sourceLink,
                forAdmin
            });
            setImageUrl("");
            setNewsTitle("");
            setNewsText("");
            setSourceLink("");
            setForAdmin(false);
            notify("News added successfully!");
        } catch (error) {
            console.error("Failed to add news. Try again later.", error);
            notify("Failed to add news. Try again later.", "error");
        }
    };

    // Delete news from Firebase
    const deleteNews = async (id: string) => {
        if (user.role !== "admin") {
            notify("You don't have permission!");
            return;
        }
        const newsRef = ref(database, `news/${id}`);
        await remove(newsRef);
        setNews(prevNews => prevNews.filter(item => item.id !== id));
        notify("News deleted successfully!");
    };

    // Fetch news from Firebase
    const fetchNews = useCallback(() => {
        const newsRef = ref(database, "news");
        const newsQuery = query(newsRef, orderByChild("date"));
        const unsubscribe = onValue(newsQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedNews = Object.entries(data)
                    .map(([id, value]: [string, any]) => ({
                        id,
                        ...value,
                    }))
                    .reverse();
                setNews(loadedNews);
                setVisibleNews(loadedNews.slice(0, postsPerPage * page));
            } else {
                setNews([]);
                setVisibleNews([]);
            }
        });
        return unsubscribe;
    }, [page]);

    // Fetch news on component mount
    useEffect(() => {
        const unsubscribe = fetchNews();
        return () => unsubscribe();
    }, [fetchNews]);

    // Load more news
    const loadMorePosts = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setVisibleNews(news.slice(0, postsPerPage * nextPage));
    };

    return (
        <div className="body-wrapper">
            <h1>My blog</h1>
            {user.role === "admin" && (
                <>
                    <Button label="Show form" onClick={() => setShowForm(!showForm)} className="show-form-button" imageRight="" imageLeft="" />
                    {showForm && (
                        <div className="form">
                            <input
                                className="title-input"
                                type="text"
                                placeholder="Title of the news"
                                value={newsTitle}
                                onChange={(e) => setNewsTitle(e.target.value)}
                            />
                            <input
                                className="image-input"
                                type="text"
                                placeholder="Put the link to the image"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <textarea
                                className="text-input"
                                placeholder="Text of the news"
                                value={newsText}
                                onChange={(e) => setNewsText(e.target.value)}
                                rows={5}
                                cols={50}
                                style={{ resize: 'vertical' }}
                            />
                            <input
                                className="source-input"
                                type="text"
                                placeholder="Put the link to the source"
                                value={sourceLink}
                                onChange={(e) => setSourceLink(e.target.value)}
                            />
                            <div className="control-box">
                                <Button label="Add news" onClick={addNews} className="add-news-button" imageRight="" imageLeft="" />
                                <label className="for-admin-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={forAdmin}
                                        onChange={(e) => setForAdmin(e.target.checked)}
                                    />
                                    Visible only for admins
                                </label>
                            </div>
                        </div>
                    )}
                </>
            )}
            <div className="news-list">
                {visibleNews.filter((item) => { return user.role === "admin" || !item.forAdmin; }).map((item) => ( // Filter by forAdmin: admins can see all news, users forAdmin: false
                    <div key={item.id} className="news-item">
                        <h2>{item.title}</h2>
                        <img src={item.imageUrl} alt="News" />
                        <p>{item.text}</p>
                        <span className="source">Read more from Source:</span>
                        <a href={item.source} target="_blank" rel="noopener noreferrer">
                            {new URL(item.source).origin}
                        </a>
                        <h4>{item.forAdmin && "Only for admin"}</h4>
                        <p className="date">{new Date(item.date).toLocaleString()}</p>
                        {user.role === "admin" && (
                            <Button label="Remove" onClick={() => deleteNews(item.id)} imageRight="" imageLeft="" />
                        )}
                    </div>
                ))}
            </div>
            {visibleNews.length < news.length && (
                <Button label="More" onClick={loadMorePosts} imageRight="" imageLeft="" />
            )}
        </div>
    );
};

export default Blog;
