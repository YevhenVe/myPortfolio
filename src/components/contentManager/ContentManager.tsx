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

// Interface for the structure of a content item
interface ContentItem {
    id: string;
    imageUrl: string;
    title: string;
    text: string;
    date: string;
    source: string;
    forAdmin: boolean;
}

// Interface for the props of the ContentManager component
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
// ContentManager component to manage and display content
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
    // State for form data, initialized with empty values
    const [formData, setFormData] = useState<Partial<ContentItem>>({
        imageUrl: "",
        title: "",
        text: "",
        source: "",
        forAdmin: false,
    });
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const [content, setContent] = useState<ContentItem[]>([]); // State for the fetched content items
    const [visibleContent, setVisibleContent] = useState<ContentItem[]>([]); // State for the currently visible content items
    const [page, setPage] = useState(1); // State for the current page number
    const [showForm, setShowForm] = useState(false); // State to toggle the form visibility
    const [editMode, setEditMode] = useState(false); // State to indicate if the form is in edit mode
    const [editId, setEditId] = useState<string | null>(null); // State to store the ID of the item being edited
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({}); // State to track loaded images
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // State for the sort order of content
    // State to control the visibility of admin-only content, default value is read from sessionStorage.
    const [hideAdminContent, setHideAdminContent] = useState<boolean>(() => {
        const storedValue = sessionStorage.getItem('hideAdminContent');
        return storedValue === 'true' ? true : false; // By dafault false, if not in the sessionStorage
    });
    // Get the user data from Redux store
    const user = useSelector((state: RootState) => state.user);
    // Function to display toast notifications
    const notify = (message: string, type: "success" | "error" = "success") => toast(message, { type });
    // Handler for image load event
    const handleImageLoad = (itemId: string) => {
        setLoadedImages(prev => ({ ...prev, [itemId]: true }));
    };
    // Handler for changes in the text area
    const handleTextChange = (value: string) => {
        setFormData((prev) => ({ ...prev, text: value }));
    };
    // Handler for input changes in the form fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };
    // Handler for form submission and saving content
    const handleSubmit = async () => {
        // Validate that all required fields are filled
        if (!formData.imageUrl || !formData.title || !formData.text || !formData.source) return;
        const contentRef = ref(database, contentPath);
        const currentDate = new Date().toISOString();
        const contentData = { ...formData, date: currentDate };
        try {
            if (editMode && editId) {
                // Update existing content if in edit mode
                await update(ref(database, `${contentPath}/${editId}`), contentData);
                // Update the local state to reflect the changes
                setContent((prev) => prev.map((item) => (item.id === editId ? { ...item, ...contentData } : item)));
                notify(`${title} updated successfully!`);
            } else {
                // Add new content if not in edit mode
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
    // Function to delete a content item
    const deleteContent = async (id: string) => {
        if (user.role !== "admin") {
            notify("You don't have permission!");
            return;
        }
        await remove(ref(database, `${contentPath}/${id}`));
        // Update local state to remove the deleted item
        setContent((prev) => prev.filter((item) => item.id !== id));
        notify(`${title} deleted successfully!`);
    };
    // useCallback hook to memoize the fetchContent function
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
    // useEffect hook to fetch content when the component mounts and whenever fetchContent changes
    useEffect(() => {
        const unsubscribe = fetchContent();
        return () => unsubscribe();
    }, [fetchContent]);
    // useEffect to save hideAdminContent to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('hideAdminContent', String(hideAdminContent));
    }, [hideAdminContent]);
    // useMemo hook to efficiently filter content based on search query and user role
    const filteredContent = React.useMemo(() => {
        let result = user.role === "admin" ? content : content.filter(item => !item.forAdmin);

        if (!hideAdminContent && user.role === "admin") {
            result = result.filter(item => !item.forAdmin);
        }
        // Filter content based on the search query
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
    // useEffect hook to sort and paginate content whenever dependencies change
    useEffect(() => {
        const sortedContent = [...filteredContent].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        const newVisibleContent = sortedContent.slice(0, postsPerPage * page);
        setVisibleContent(newVisibleContent);
    }, [filteredContent, page, postsPerPage, sortOrder]);
    // useEffect hook to reset the page to 1 whenever the search query changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);
    // Function to load more posts
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