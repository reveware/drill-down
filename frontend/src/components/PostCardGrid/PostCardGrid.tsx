import React from 'react';
import { PostCard, PostCardDetailModal } from '..';
import './PostCardGrid.scss';
import '../../styles/index.scss';
import { useState } from 'react';
import { Populated, Post } from '@drill-down/interfaces';
import { Card } from 'react-bootstrap';

interface PostCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    posts: Populated<Post>[];
    postSize?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const PostCardGrid: React.FC<PostCardGridProps> = (props) => {
    const { title, posts, postSize, className } = props;
    const [selectedPostForDetails, setSelectedPostForDetails] = useState<Populated<Post> | null>(null);

    const onViewDetails = (post: Populated<Post>) => {
        setSelectedPostForDetails(post);
    };

    const onHideDetails = () => {
        setSelectedPostForDetails(null);
    };

    if (posts.length === 0) {
        return null;
    }


    return (
        <Card className={`post-card-grid ${className ?? ''}`}>
            {title && <h1>{title}</h1>}
            <div className="post-card-grid-content">
                <div className="grid">
                    {posts.map((post, i) => {
                        return (
                            <div key={i} className="item">
                                <PostCard post={post} onViewDetails={onViewDetails} size={postSize} />
                            </div>
                        );
                    })}
                </div>
            </div>
            {selectedPostForDetails && <PostCardDetailModal onHide={onHideDetails} post={selectedPostForDetails} />}
        </Card>
    );
};
