import React from 'react';
import { Post } from '..';
import { CardColumns } from 'react-bootstrap';

interface PostGridProps {
    posts: any[];
}

export const PostGrid: React.FC<PostGridProps> = (props) => {
    const { posts } = props;
    return (
        <CardColumns>
            {posts.map((post) => {
                return <Post />;
            })}
        </CardColumns>
    );
};
