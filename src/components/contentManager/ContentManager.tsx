// ContentManager.tsx

import React, { useState, useEffect, useCallback } from "react";
import { database } from "../../../Firebase";
import { ref, query, orderByChild, onValue, remove, push, update } from "firebase/database";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import CustomForm from "../../components/customForm/CustomForm";
import Button from "../../components/button/Button";
import SearchBar from "../searchBar/SearchBar"; // Import the SearchBar component
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
    contentPath: string;
    title: string;
    postsPerPage: number;
    onClick: (id: string, date: string, title: string, text: string, source: string, imageUrl: string) => void;
    contentItemClassName: string;
    contentImageClassName: string;
    contentTitleClassName: string;
    contentTextClassName: string | ((id: string) => string);
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
    const [searchQuery, setSearchQuery] = useState('');
    const [content, setContent] = useState<ContentItem[]>([]);
    const [visibleContent, setVisibleContent] = useState<ContentItem[]>([]);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [hideAdminContent, setHideAdminContent] = useState<boolean>(() => {
        const storedValue = sessionStorage.getItem('hideAdminContent');
        return storedValue === 'true' ? true : false; // By dafault false, if not in the sessionStorage
    });
    const user = useSelector((state: RootState) => state.user);
    const notify = (message: string, type: "success" | "error" = "success") => toast(message, { type });

    const handleImageLoad = (itemId: string) => {
        setLoadedImages(prev => ({ ...prev, [itemId]: true }));
    };

    const handleTextChange = (value: string) => {
        setFormData((prev) => ({ ...prev, text: value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

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

    const deleteContent = async (id: string) => {
        if (user.role !== "admin") {
            notify("You don't have permission!");
            return;
        }
        await remove(ref(database, `${contentPath}/${id}`));
        setContent((prev) => prev.filter((item) => item.id !== id));
        notify(`${title} deleted successfully!`);
    };

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
                const initialVisibleContent = loadedContent
                    .filter(item => (user.role === "admin" && hideAdminContent) || !item.forAdmin)
                    .slice(0, postsPerPage * page);
                setVisibleContent(initialVisibleContent);
            } else {
                setContent([]);
                setVisibleContent([]);
            }
        });
        return unsubscribe;
    }, [contentPath, page, postsPerPage, user.role, hideAdminContent]);

    useEffect(() => {
        const unsubscribe = fetchContent();
        return () => unsubscribe();
    }, [fetchContent]);

    useEffect(() => {
        sessionStorage.setItem('hideAdminContent', String(hideAdminContent));
    }, [hideAdminContent]);

    const filteredContent = React.useMemo(() => {
        let result = user.role === "admin" ? content : content.filter(item => !item.forAdmin);

        if (!hideAdminContent && user.role === "admin") {
            result = result.filter(item => !item.forAdmin);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.text.toLowerCase().includes(query) ||
                item.source.toLowerCase().includes(query) ||
                new Date(item.date).toLocaleString().toLowerCase().includes(query)
            );
        }
        return result;
    }, [content, user.role, hideAdminContent, searchQuery]);

    useEffect(() => {
        const sortedContent = [...filteredContent].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        const newVisibleContent = sortedContent.slice(0, postsPerPage * page);
        setVisibleContent(newVisibleContent);
    }, [filteredContent, page, postsPerPage, sortOrder]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const loadMorePosts = () => {
        const userContent = user.role === "admin" ? content : content.filter(item => !item.forAdmin);
        const nextPage = page + 1;
        setPage(nextPage);
        setVisibleContent(userContent.slice(0, postsPerPage * nextPage));
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
                            textOnChange={handleTextChange}
                            sourceValue={formData.source || ""}
                            sourceOnChange={handleChange}
                            imageUrlValue={formData.imageUrl || ""}
                            imageUrlOnChange={handleChange}
                            forAdminValue={formData.forAdmin || false}
                            forAdminOnChange={handleChange}
                            handleSubmit={handleSubmit}
                            CancelOnClick={() => {
                                setShowForm(false);
                                setFormData({ imageUrl: "", title: "", text: "", source: "", forAdmin: false });
                                setEditMode(false);
                                setEditId(null);
                            }}
                            editMode={editMode}
                        />
                    )}
                </div>
            )}
            <div className={`content-list ${contentListClassName}`}>
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortOrder={sortOrder}
                    onSortChange={setSortOrder}
                    hideAdminContent={hideAdminContent}
                    onHideAdminContentChange={setHideAdminContent}
                    userRole={user.role || ""}
                    locationPathname={location.pathname}
                    visibleContentLength={visibleContent.length}

                />
                <div className="content-list-wrapper">
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
                                    <div className="image-wrapper">
                                        {!loadedImages[item.id] && <div className="preloader" />}
                                        <img
                                            className={`${contentImageClassName} ${loadedImages[item.id] ? "loaded" : "loading"}`}
                                            src={item.imageUrl}
                                            alt={item.title}
                                            onLoad={() => handleImageLoad(item.id)}
                                        />
                                    </div>
                                    <div className={contentTitleClassName}>{item.forAdmin ? <span style={{ color: "red" }}><div className="for-admin">A</div></span> : null} {item.title}</div>
                                    <div className={textClassName} />
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
            </div>

            {filteredContent.length > visibleContent.length && (
                <Button
                    label="Load more"
                    className="load-more-button"
                    onClick={loadMorePosts}
                    imageRight=""
                    imageLeft=""
                />
            )}
        </div>
    );
};

export default ContentManager;