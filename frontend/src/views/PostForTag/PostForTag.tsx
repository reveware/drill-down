import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostCardGrid, PostCardBanner } from '../../components';
import { Post } from '@drill-down/interfaces';

import './PostForTag.scss';
import { AppService } from '../../services';
export const PostForTag: React.FC = () => {
    const params = useParams<{ tag: string }>();
    const [posts, setPosts] = useState<Post[]>([]);

    const tag = params.tag;

    const getPostsForTag = async (tag: string) => {
        const appService = new AppService();
        const posts = await appService.getPostsForTag(tag);
        setPosts(posts);
    };

    useEffect(() => {
        getPostsForTag(tag);
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
