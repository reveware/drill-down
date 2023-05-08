import React from 'react';
import { PostCard, PostCardDetailModal } from '../../../components';
import './PostCardGrid.scss';
import { useState } from 'react';
import { PostOverview } from '@drill-down/interfaces';
import { Card } from 'react-bootstrap';

interface PostCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    posts: PostOverview[];
    postSize?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const PostCardGrid: React.FC<PostCardGridProps> = (props) => {
    const { title, posts, postSize, className } = props;
    const [selectedPostForDetails, setSelectedPostForDetails] = useState<PostOverview | null>(null);

    const handleViewDetails = (post: PostOverview) => {
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
            <div className="grid">
                {posts.map((post, i) => {
                    return (
                        <div key={i} className="item">
                            <PostCard post={post} onClick={handleViewDetails} size={postSize} />
                        </div>
                    );
                })}
            </div>
            {selectedPostForDetails && <PostCardDetailModal onHide={onHideDetails} post={selectedPostForDetails} />}
        </Card>
    );
};
