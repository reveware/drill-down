import React from 'react';
import { Card } from 'react-bootstrap';
import {PhotoPost, Populated, Post, PostTypes} from '@drill-down/common';
import './PostCard.scss';
import { TagList } from '../TagList/TagList';
import { formatUnixTimestamp } from '../../utils';

interface PostCardProps {
    post: Populated<Post>;
    onViewDetails: (post: Populated<Post>) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const PostCard: React.FC<PostCardProps> = (props) => {
    const { post, onViewDetails, size } = props;


    return (
        <Card id={`post-card-${post._id}`} className={`post-card ${size ?? ''}`}>
            <div className="post-card-content" onClick={() => {onViewDetails(post)}}>
                {post.type === PostTypes.PHOTO ? (
                    <Card.Img
                        variant="top"
                        className="post-card-img"
                        src={
                            (props.post.body as PhotoPost).urls[0]
                        }
                    />
                ) : (
                    `${JSON.stringify(post)}`
                )}
            </div>

            <div className="post-card-detail">
                <TagList className="post-card-tags" tags={post.tags} />
                <div className="post-card-meta">
                    <span>{formatUnixTimestamp(post.createdAt)}</span>
                </div>
            </div>
        </Card>
    );
};
