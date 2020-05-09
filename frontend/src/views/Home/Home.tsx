import React from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { PostGrid } from '../../components';
import './Home.scss';

export const Home = () => {
    const { user } = useSelector((store: StoreState) => store.user);

    console.log('user', user);

    const postsFromStarredTags = [1, 2, 3, 2, 3];
    const commonPosts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3];

    return (
        <div className="home-view">
            <PostGrid id="starred-posts" title="Starred" posts={postsFromStarredTags} />

            <PostGrid id="common-posts" title="Common" posts={commonPosts} />
        </div>
    );
};
