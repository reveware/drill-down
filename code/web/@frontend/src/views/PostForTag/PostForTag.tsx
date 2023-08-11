import React from 'react';
import { useParams } from 'react-router-dom';
import { PostCardGrid, PostCardBanner, NoPostsFound } from '../../components';

import './PostForTag.scss';

import { useGetPostsQuery } from 'src/hooks';

export const PostForTag: React.FC = () => {
    const params = useParams<{ tag: string }>();
    const tag = params.tag!;

    // TODO: handle loading, error
    const { data: posts } = useGetPostsQuery({ tags: tag });

    const atLeastOnePost = posts && posts.length > 1;
    if (!posts) {
        return <NoPostsFound query="tags" />;
    }
    return (
        <React.Fragment>
            <div className="post-for-tag">
                <div className="mb-5">
                    <PostCardBanner title={tag} post={posts[0]} />
                </div>

                {atLeastOnePost ? <PostCardGrid posts={posts.slice(1, posts.length)} postSize="md" /> : <NoPostsFound query="tags" />}
            </div>
        </React.Fragment>
    );
};
