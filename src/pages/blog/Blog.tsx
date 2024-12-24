import React from 'react';
import ContentManager from '../../components/contentManager/ContentManager';
import './Blog.scss';

const Blog: React.FC = () => {
    return (
        <div className="news-wrapper">
            <ContentManager
                contentPath="news"
                title="Blog"
                postsPerPage={5}
                contentItemClassName="news-item"
                contentImageClassName="news-image"
                contentTitleClassName="news-title"
                contentTextClassName="news-body"
                contentDataClassName="news-data"
                contentListClassName="news-list"
                contentSourceClassName="news-source"
            />
        </div>
    );
};

export default Blog;
