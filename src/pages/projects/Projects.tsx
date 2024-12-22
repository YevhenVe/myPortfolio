import React, { useState, useEffect, useCallback } from "react";
import { database } from "../../../Firebase";
import { ref, query, orderByChild, onValue, remove, push, update } from "firebase/database";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";
import CustomForm from "../../components/customForm/CustomForm";
import "./Projects.scss";

interface ProjectItem {
    id: string;
    imageUrl: string;
    title: string;
    text: string;
    date: string;
    source: string;
    forAdmin: boolean;
}

const Projects: React.FC = () => {
    const [formData, setFormData] = useState({ imageUrl: "", title: "", text: "", source: "", forAdmin: false });
    const [project, setProject] = useState<ProjectItem[]>([]);
    const [visibleProject, setVisibleProject] = useState<ProjectItem[]>([]);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [openPost, setOpenPost] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.user);
    const postsPerPage = 8;
    const notify = (message: string, type: "success" | "error" = "success") => toast(message, { type });

    // Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    // Submit project
    const handleSubmit = async () => {
        const { imageUrl, title, text, source, forAdmin } = formData;
        if (!imageUrl || !title || !text || !source) return;
        const projectRef = ref(database, "projects");
        const currentDate = new Date().toISOString();
        const projectData = { imageUrl, title, text, date: currentDate, source, forAdmin };
        try {
            if (editMode && editId) {
                await update(ref(database, `projects/${editId}`), projectData);
                setProject((prev) => prev.map((item) => (item.id === editId ? { ...item, ...projectData } : item)));
                notify("Project updated successfully!");
            } else {
                await push(projectRef, projectData);
                notify("Project added successfully!");
            }
            setFormData({ imageUrl: "", title: "", text: "", source: "", forAdmin: false });
            setEditMode(false);
            setEditId(null);
        } catch (error) {
            console.error("Failed to save Project. Try again later.", error);
            notify("Failed to save Project. Try again later.", "error");
        }
    };

    // Delete project
    const deleteProject = async (id: string) => {
        if (user.role !== "admin") {
            notify("You don't have permission!");
            return;
        }
        await remove(ref(database, `projects/${id}`));
        setProject((prev) => prev.filter((item) => item.id !== id));
        notify("Project deleted successfully!");
    };

    // Fetch projects
    const fetchProject = useCallback(() => {
        const projectRef = ref(database, "projects");
        const projectQuery = query(projectRef, orderByChild("date"));
        const unsubscribe = onValue(projectQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedProject = Object.entries(data)
                    .map(([id, value]: [string, any]) => ({ id, ...value }))
                    .reverse();
                setProject(loadedProject);
                setVisibleProject(loadedProject.slice(0, postsPerPage * page));
            } else {
                setProject([]);
                setVisibleProject([]);
            }
        });
        return unsubscribe;
    }, [page]);

    // Fetch news
    useEffect(() => {
        const unsubscribe = fetchProject();
        return () => unsubscribe();
    }, [fetchProject]);

    // Load more news
    const loadMorePosts = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setVisibleProject(project.slice(0, postsPerPage * nextPage));
    };

    // Edit project
    const setProjectToEdit = (project: ProjectItem) => {
        setEditMode(true);
        setEditId(project.id);
        setFormData({ imageUrl: project.imageUrl, title: project.title, text: project.text, source: project.source, forAdmin: project.forAdmin });
        setShowForm(true);
    };

    // Cancel edit mode
    const cancelEdit = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ imageUrl: "", title: "", text: "", source: "", forAdmin: false });
        setShowForm(false);
    };

    return (
        <div className="body-wrapper projects">
            <h1>My Projects</h1>
            {user.role === "admin" && (
                <>
                    <Button
                        label="Show form"
                        onClick={() => setShowForm(!showForm)}
                        className="show-form-button"
                        imageRight=""
                        imageLeft=""
                    />
                    {showForm && (
                        <CustomForm
                            titleValue={formData.title}
                            titleOnChange={handleChange}
                            textValue={formData.text}
                            textOnChange={handleChange}
                            sourceValue={formData.source}
                            sourceOnChange={handleChange}
                            imageUrlValue={formData.imageUrl}
                            imageUrlOnChange={handleChange}
                            forAdminValue={formData.forAdmin}
                            forAdminOnChange={handleChange}
                            handleSubmit={handleSubmit}
                            CancelOnClick={cancelEdit}
                            editMode={editMode}
                        />
                    )}
                </>
            )}
            <div className="projects-list">
                {visibleProject
                    .filter((item) => user.role === "admin" || !item.forAdmin)
                    .map((item) => (
                        <div key={item.id} className={openPost === item.id ? "project-item-opened" : "project-item"} onClick={(e) => {
                            if (e.target instanceof HTMLAnchorElement) {
                                return;
                            }
                            setOpenPost(openPost === item.id ? null : item.id);
                        }}>
                            <div className="post-title">{item.title}</div>
                            <img
                                src={item.imageUrl}
                                alt="Project"
                            />
                            <div className="post-body post-body-opened">{item.text}</div>
                            <span className="source">Source:</span>
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
                                <div className="button-box">
                                    <Button
                                        label="Edit"
                                        onClick={() => setProjectToEdit(item)}
                                        imageRight=""
                                        imageLeft=""
                                    />
                                    <Button
                                        label="Remove"
                                        onClick={() => deleteProject(item.id)}
                                        imageRight=""
                                        imageLeft=""
                                    />
                                </div>
                            )}
                        </div>
                    ))}
            </div>
            {visibleProject.length < project.length && (
                <Button
                    label="More"
                    onClick={loadMorePosts}
                    imageRight=""
                    imageLeft=""
                />
            )}
        </div>
    );
};

export default Projects;
