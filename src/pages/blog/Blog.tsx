import React, { useState, useEffect, useCallback } from "react";
import { database } from "../../../Firebase";
import { ref, query, orderByChild, onValue, remove, push, update } from "firebase/database";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import CustomForm from "../../components/customForm/CustomForm";
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
    const [currentNews, setCurrentNews] = useState<Partial<NewsItem>>({
        imageUrl: "",
        title: "",
        text: "",
        source: "",
        forAdmin: false,
    });
    const [news, setNews] = useState<NewsItem[]>([]);
    const [visibleNews, setVisibleNews] = useState<NewsItem[]>([]);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const postsPerPage = 5;
    const notify = (message: string, type: "success" | "error" = "success") => toast(message, { type });

    // Add or update news in Firebase
    const saveNews = async () => {
        if (!currentNews.imageUrl || !currentNews.title || !currentNews.text || !currentNews.source) return;
        try {
            if (isEditing && currentNews.id) {
                const newsRef = ref(database, `news/${currentNews.id}`);
                await update(newsRef, currentNews);
                notify("News updated successfully!");
            } else {
                const newsRef = ref(database, "news");
                const currentDate = new Date().toISOString();
                await push(newsRef, {
                    ...currentNews,
                    date: currentDate,
                });
                notify("News added successfully!");
            }
            resetForm();
        } catch (error) {
            console.error("Failed to save news. Try again later.", error);
            notify("Failed to save news. Try again later.", "error");
        }
    };

    // Reset form and editing state
    const resetForm = () => {
        setCurrentNews({
            imageUrl: "",
            title: "",
            text: "",
            source: "",
            forAdmin: false,
        });
        setIsEditing(false);
        setShowForm(false);
    };

    // Delete news from Firebase
    const deleteNews = async (id: string) => {
        if (user.role !== "admin") {
            notify("You don't have permission!");
            return;
        }
        const newsRef = ref(database, `news/${id}`);
        await remove(newsRef);
        setNews((prevNews) => prevNews.filter((item) => item.id !== id));
        notify("News deleted successfully!");
    };

    // Start editing news
    const startEditing = (newsItem: NewsItem) => {
        setCurrentNews(newsItem);
        setIsEditing(true);
        setShowForm(true);
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
        <div className="blog-wrapper">
            <h1>Blog</h1>
            {user.role === "admin" && (
                <>
                    <Button
                        label={showForm ? "Hide form" : "Show form"}
                        onClick={() => setShowForm(!showForm)}
                        className="show-form-button"
                        imageRight=""
                        imageLeft=""
                    />
                    {showForm && (
                        <CustomForm
                            titleValue={currentNews.title || ""}
                            titleOnChange={(e) => setCurrentNews({ ...currentNews, title: e.target.value })}
                            textValue={currentNews.text || ""}
                            textOnChange={(e) => setCurrentNews({ ...currentNews, text: e.target.value })}
                            sourceValue={currentNews.source || ""}
                            sourceOnChange={(e) => setCurrentNews({ ...currentNews, source: e.target.value })}
                            imageUrlValue={currentNews.imageUrl || ""}
                            imageUrlOnChange={(e) => setCurrentNews({ ...currentNews, imageUrl: e.target.value })}
                            forAdminValue={currentNews.forAdmin || false}
                            forAdminOnChange={(e) => setCurrentNews({ ...currentNews, forAdmin: e.target.checked })}
                            handleSubmit={saveNews}
                            CancelOnClick={resetForm}
                            editMode={isEditing}
                        />

                    )}
                </>
            )}
            <div className="news-list">
                {visibleNews
                    .filter((item) => {
                        return user.role === "admin" || !item.forAdmin;
                    })
                    .map((item) => (
                        <div
                            key={item.id}
                            className="news-item"
                        >
                            <h2>{item.title}</h2>
                            <img
                                src={item.imageUrl}
                                alt="News"
                            />
                            <p>{item.text}</p>
                            <span className="source">Read more on the source:</span>
                            <a
                                href={item.source}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {new URL(item.source).origin}
                            </a>
                            <h4>{item.forAdmin && "Only for admin"}</h4>
                            <p className="date">{new Date(item.date).toLocaleString()}</p>
                            {user.role === "admin" && (
                                <div className="control-box">
                                    <Button
                                        label="Remove"
                                        onClick={() => deleteNews(item.id)}
                                        imageRight=""
                                        imageLeft=""
                                    />
                                    <Button
                                        label="Edit"
                                        onClick={() => startEditing(item)}
                                        imageRight=""
                                        imageLeft=""
                                    />
                                </div>
                            )}
                        </div>
                    ))}
            </div>
            {visibleNews.length < news.length && (
                <Button
                    label="Load more"
                    onClick={loadMorePosts}
                    imageRight=""
                    imageLeft=""
                />
            )}
        </div>
    );
};

export default Blog;
