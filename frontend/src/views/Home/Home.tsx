import React from 'react';
import { PostGrid } from '../../components';
import './Home.scss';

export const Home = () => {
    const postsFromStarredTags = [1, 2, 3, 2, 3];
    const commonPosts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3];

    return (
        <div className="home-view">
            <PostGrid id="starred-posts" title="Starred" posts={postsFromStarredTags} />

            <PostGrid id="common-posts" title="Common" posts={commonPosts} />
        </div>
    );
};
