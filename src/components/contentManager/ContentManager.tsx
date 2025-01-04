import React, { useState, useEffect, useCallback } from "react";
import { database } from "../../../Firebase";
import { ref, query, orderByChild, onValue, remove, push, update } from "firebase/database";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import CustomForm from "../../components/customForm/CustomForm";
import Button from "../../components/button/Button";
import "./ContentManager.scss";

interface ContentItem {
    id: string;
    imageUrl: string;
    title: string;
    text: string;
    date: string;
    source: string;
    forAdmin: boolean;
}

export interface ContentManagerProps {
    contentPath: string; // Path in the database (e.g., "projects" or "news")
    title: string; // Page title
    postsPerPage: number; // Number of items per page
    onClick: (id: string, date: string, title: string, text: string, source: string, imageUrl: string) => void; // Function to handle item click
    contentItemClassName: string;
    contentImageClassName: string;
    contentTitleClassName: string;
    contentTextClassName: string | ((id: string) => string); // Теперь принимает строку или функцию
    contentDataClassName: string;
    contentListClassName: string;
    contentSourceClassName: string;
}


const ContentManager: React.FC<ContentManagerProps> = ({
    contentPath,
    title,
    postsPerPage,
    contentItemClassName,
    contentImageClassName,
    contentTitleClassName,
    contentTextClassName,
    contentDataClassName,
    contentListClassName,
    contentSourceClassName,
    onClick
}) => {
    const [formData, setFormData] = useState<Partial<ContentItem>>({
        imageUrl: "",
        title: "",
        text: "",
        source: "",
        forAdmin: false,
    });
    const [content, setContent] = useState<ContentItem[]>([]);
    const [visibleContent, setVisibleContent] = useState<ContentItem[]>([]);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const user = useSelector((state: RootState) => state.user);

    const notify = (message: string, type: "success" | "error" = "success") => toast(message, { type });

    const handleImageLoad = (itemId: string) => {
        setLoadedImages(prev => ({ ...prev, [itemId]: true }));
    };

    // Function to handle input changes in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    // Function to handle form submission (add or update content)
    const handleSubmit = async () => {
        if (!formData.imageUrl || !formData.title || !formData.text || !formData.source) return;
        const contentRef = ref(database, contentPath);
        const currentDate = new Date().toISOString();
        const contentData = { ...formData, date: currentDate };
        try {
            if (editMode && editId) {
                await update(ref(database, `${contentPath}/${editId}`), contentData);
                setContent((prev) => prev.map((item) => (item.id === editId ? { ...item, ...contentData } : item)));
                notify(`${title} updated successfully!`);
            } else {
                await push(contentRef, contentData);
                notify(`${title} added successfully!`);
            }
            setFormData({ imageUrl: "", title: "", text: "", source: "", forAdmin: false });
            setEditMode(false);
            setEditId(null);
        } catch (error) {
            console.error(`Failed to save ${title}. Try again later.`, error);
            notify(`Failed to save ${title}. Try again later.`, "error");
        }
    };

    // Function to delete content
    const deleteContent = async (id: string) => {
        if (user.role !== "admin") {
            notify("You don't have permission!");
            return;
        }
        await remove(ref(database, `${contentPath}/${id}`));
        setContent((prev) => prev.filter((item) => item.id !== id));
        notify(`${title} deleted successfully!`);
    };

    // Function to fetch content
    const fetchContent = useCallback(() => {
        const contentRef = ref(database, contentPath);
        const contentQuery = query(contentRef, orderByChild("date"));
        const unsubscribe = onValue(contentQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedContent = Object.entries(data)
                    .map(([id, value]: [string, any]) => ({ id, ...value }))
                    .reverse();
                setContent(loadedContent);
                setVisibleContent(loadedContent.slice(0, postsPerPage * page));
            } else {
                setContent([]);
                setVisibleContent([]);
            }
        });
        return unsubscribe;
    }, [contentPath, page, postsPerPage]);

    // Fetch content on component mount
    useEffect(() => {
        const unsubscribe = fetchContent();
        return () => unsubscribe();
    }, [fetchContent]);

    // Load more content
    const loadMorePosts = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setVisibleContent(content.slice(0, postsPerPage * nextPage));
    };

    return (
        <div className="content-manager">
            <h1>{title}</h1>
            {user.role === "admin" && (
                <div className="form-wrapper">
                    <Button
                        label={showForm ? "Hide form" : "Show form"}
                        onClick={() => setShowForm(!showForm)}
                        className={`show-form-button ${!showForm ? "in-active" : ""}`}
                        imageRight=""
                        imageLeft=""
                    />
                    {showForm && (
                        <CustomForm
                            titleValue={formData.title || ""}
                            titleOnChange={handleChange}
                            textValue={formData.text || ""}
                            textOnChange={handleChange}
                            sourceValue={formData.source || ""}
                            sourceOnChange={handleChange}
                            imageUrlValue={formData.imageUrl || ""}
                            imageUrlOnChange={handleChange}
                            forAdminValue={formData.forAdmin || false}
                            forAdminOnChange={handleChange}
                            handleSubmit={handleSubmit}
                            CancelOnClick={() => {
                                setShowForm(false); //Hide form
                                setFormData({ imageUrl: "", title: "", text: "", source: "", forAdmin: false }); // Clear form
                                setEditMode(false); // Get out of edit mode
                                setEditId(null); // Remove Id of the edited item
                            }}
                            editMode={editMode}
                        />
                    )}
                </div>
            )}
            <div className={`content-list ${contentListClassName}`}>
                {location.pathname !== "/projects" && visibleContent.length >= 2 && (
                    <Button
                        label={`Sort: ${sortOrder === "asc" ? "Old to New" : "New to Old"}`}
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                        className="sort-button"
                        imageRight=""
                        imageLeft=""
                    />)
                }
                {visibleContent
                    .filter((item) => user.role === "admin" || !item.forAdmin)
                    .sort((a, b) => {
                        const dateA = new Date(a.date).getTime();
                        const dateB = new Date(b.date).getTime();
                        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
                    })
                    .map((item) => {
                        const textClassName =
                            typeof contentTextClassName === "function"
                                ? contentTextClassName(item.id)
                                : contentTextClassName;

                        return (
                            <div
                                key={item.id}
                                className={contentItemClassName}
                                onClick={() => onClick(item.id, item.date, item.title, item.text, item.source, item.imageUrl)}
                            >
                                <div className={contentTitleClassName}>{item.title}</div>
                                <div className="image-wrapper">
                                    {!loadedImages[item.id] && <div className="preloader" />}
                                    <img
                                        className={`${contentImageClassName} ${loadedImages[item.id] ? "loaded" : "loading"}`}
                                        src={item.imageUrl}
                                        alt={item.title}
                                        onLoad={() => handleImageLoad(item.id)}
                                    />
                                </div>
                                <div className={textClassName}>{item.text}</div>
                                <div className={contentSourceClassName}>
                                    <span>Source:</span>
                                    <a
                                        href={item.source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {item.source.split("/")[2]}
                                    </a>
                                </div>
                                <div className={contentDataClassName}>
                                    {new Date(item.date).toLocaleString()}
                                </div>
                                {user.role === "admin" && (
                                    <div className="button-box">
                                        <Button
                                            label="Edit"
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                setShowForm(true);
                                                setEditMode(true);
                                                setEditId(item.id);
                                                setFormData(item);
                                            }}
                                            imageRight=""
                                            imageLeft=""
                                        />
                                        <Button
                                            label="Delete"
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                deleteContent(item.id);
                                            }}
                                            imageRight=""
                                            imageLeft=""
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
            {visibleContent.length < content.length && (
                <Button label="Load more" className="load-more-button" onClick={loadMorePosts} imageRight="" imageLeft="" />
            )}
        </div>
    );
};

export default ContentManager;
