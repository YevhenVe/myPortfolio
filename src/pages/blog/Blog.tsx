import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContentManager from '../../components/contentManager/ContentManager';
import './Blog.scss';

const Blog: React.FC = () => {
    const navigate = useNavigate();

    const handleNewsClick = (id: string) => {
        navigate(`/blog/${id}`);
    };
    return (
        <div className="news-wrapper">
            <ContentManager
                contentPath="news"
                title="Blog"
                postsPerPage={6}
                contentItemClassName="news-item"
                contentImageClassName="news-image"
                contentTitleClassName="news-title"
                contentTextClassName="news-body"
                contentDataClassName="news-data"
                contentListClassName="news-list"
                contentSourceClassName="news-source"
                onClick={handleNewsClick}
            />
        </div>
    );
};

export default Blog;
