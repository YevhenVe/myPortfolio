import React, { useState } from 'react';
import ContentManager from '../../components/contentManager/ContentManager';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import './Projects.scss';

interface ContentItem {
    id: string;
    title: string;
    text: string;
    date: string;
    source: string;
    imageUrl: string;
}

const Projects: React.FC = () => {
    const [activePost, setActivePost] = useState<ContentItem | null>(null);

    const handlePostClick = (
        id: string,
        date: string,
        title: string,
        text: string,
        source: string,
        imageUrl: string
    ) => {
        setActivePost({ id, date, title, text, source, imageUrl });
    };

    const postImage = (imageUrl: string): JSX.Element => {
        return <img src={imageUrl} alt="project" />;
    };

    return (
        <div className="projects-wrapper">
            <ContentManager
                contentPath="projects"
                title="My Projects"
                postsPerPage={8}
                contentItemClassName="project-item"
                contentListClassName="projects-list"
                contentTitleClassName="project-title"
                contentImageClassName="project-image"
                contentTextClassName={(id: string) =>
                    `project-body ${activePost && activePost.id === id ? "opened-post" : ""}`
                }
                contentSourceClassName="project-source"
                contentDataClassName="project-data"
                onClick={handlePostClick}
            />
            {activePost && (
                <ModalWindow onClick={() => setActivePost(null)}>
                    <div className='opened-post-wrapper'>
                        <h2>{activePost.title}</h2>
                        {postImage(activePost.imageUrl)}
                        <p>{activePost.text}</p>
                        <div className='source'>Source: <a href={activePost.source} target="_blank" rel="noopener noreferrer">{activePost.source.split("/")[2]}</a></div>
                        {/* <div className='date'>{new Date(activePost.date).toLocaleString()}</div> */}
                    </div>
                </ModalWindow>
            )}
        </div>
    );
};

export default Projects;
