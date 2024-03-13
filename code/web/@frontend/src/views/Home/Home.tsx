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

    const reversed = posts.slice(0).reverse();
    return (
        <div className="home-view">
        <PostCardGrid title="Latest Posts" className="latest-posts neon-border" posts={posts} postSize="md" />

        <PostCardGrid title="Reversed Posts" className="reverese-posts neon-border" posts={reversed} postSize="sm" />
        </div>
    );
};
