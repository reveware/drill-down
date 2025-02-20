import React from 'react';
import { PostCardGrid, NoContent, Loading } from '../../components';
import './Home.scss';
import { useGetPostsQuery } from '../../hooks';
import _ from 'lodash';

export const Home = () => {
    // TODO: handle errors
    const { data: posts, isLoading } = useGetPostsQuery({});

    if (isLoading) {
        return <Loading />;
    }

    if (!posts || _.isEmpty(posts)) {
        return <NoContent />;
    }

    return (
        <div className="home-view">
            <div className='posts-column'>
             <PostCardGrid className="neon-border" posts={posts} postSize="md" />
            </div>
        </div>
    );
};
