import React from 'react';
import Card from 'react-bootstrap/Card';
import { QuotePost } from './QuotePost/QuotePost';
import { PostOverview, PostTypes, UserRole } from '@drill-down/interfaces';

import moment from 'moment';
import './PostCard.scss';

import { TagList } from 'src/components';
import { selectLoggedInUser, useAppSelector } from 'src/store';

interface PostCardProps {
    post: PostOverview;
    onClick: (post: PostOverview) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const PostCard: React.FC<PostCardProps> = (props: PostCardProps) => {
    const { post, onClick, size } = props;
    const loggedInUser = useAppSelector(selectLoggedInUser);

    const isAdmin = () => {
        return loggedInUser?.role === UserRole.ADMIN;
    };
    const formaToRelativeDate = (date: Date): string => {
        return moment(date).fromNow();
    };

    return (
        <Card id={`post-card-${post.id}`} className={`post-card ${size ?? ''}`}>
            <div
                className="post-card-content"
                onClick={() => {
                    onClick(post);
                }}>
                {post.type === PostTypes.PHOTO && (
                    // TODO: remame "ImgPost" and move to PostComponents
                    <Card.Img variant="top" className="post-card-img" src={post.content.urls[0]} />
                )}

                {post.type === PostTypes.QUOTE && <QuotePost variant="handwritting" post={post} />}

                {isAdmin() &&
                    // TODO: if (user.admin), should be for debug, logs/visual.log
                    `${JSON.stringify(post)}`}
            </div>

            <div className="post-card-detail">
                <TagList className="post-card-tags" tags={post.tags} />
                <div className="post-card-meta">
                    <span>{formaToRelativeDate(post.created_at)}</span>
                </div>
            </div>
        </Card>
    );
};
