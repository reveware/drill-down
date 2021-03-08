import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostCardGrid, PostCardBanner } from '../../components';
import { Post } from '@drill-down/interfaces';

import './PostForTag.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsForTag, selectPostsForTag } from '../../store';
import { RootState } from '../../store/store.type';
export const PostForTag: React.FC = () => {
    const params = useParams<{ tag: string }>();
    const tag = params.tag;

    const dispatch = useDispatch();
    const posts = useSelector((state: RootState) => {
        return selectPostsForTag(state, tag);
    });

    useEffect(() => {
        dispatch(fetchPostsForTag(tag));
    }, [tag]);

    return (
        <React.Fragment>
            <div className="post-for-tag">
                <div className="mb-5">
                    <PostCardBanner title={tag} post={posts[0] as Post} />
                </div>

                <PostCardGrid id={`posts-for-${tag}`} title="" posts={posts.slice(1, posts.length)} />
            </div>
        </React.Fragment>
    );
};
