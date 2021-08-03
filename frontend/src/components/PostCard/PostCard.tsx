import React from 'react';
import { Card } from 'react-bootstrap';
import { PhotoPost, Populated, Post, PostTypes } from '@drill-down/interfaces';
import './PostCard.scss';
import { TagList } from '../TagList/TagList';
import { formatUnixTimestamp } from '../../utils';

interface PostCardProps {
    post: Populated<Post>;
    onViewDetails: (id: string) => any;
}

export const PostCard: React.FC<PostCardProps> = (props) => {
    const { post, onViewDetails } = props;

    return (
        <Card className="post-card">
            {post.type === PostTypes.PHOTO ? (
                <Card.Img
                    variant="top"
                    className="post-card-img"
                    src={
                        (props.post.body as PhotoPost).urls[0] ||
                        'https://66.media.tumblr.com/ce59da0b36a695b698e5df2976e0f180/tumblr_pedwbdEEbq1wa84xco1_500.jpg' //TODO: proper placeholder
                    }
                />
            ) : (
                `${JSON.stringify(post)}`
            )}
            
            <div className="m-1">
                <div className="post-card-tags text-muted">{<TagList tags={post.tags} />}</div>

                <div className="post-card-detail">
                    <span>{formatUnixTimestamp(post.createdAt)}</span>
                    <span>
                        <button
                            className="button-as-link"
                            onClick={() => {
                                onViewDetails(post._id);
                            }}>
                            View
                        </button>
                    </span>
                </div>
            </div>
        </Card>
    );
};
