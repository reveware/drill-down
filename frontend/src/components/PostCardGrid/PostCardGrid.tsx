import React from 'react';
import { PostCard, PostCardDetailModal } from '..';
import './PostCardGrid.scss';
import '../../styles/index.scss';
import { useState } from 'react';
import { Populated, Post } from '@drill-down/interfaces';
import { Row, Col } from 'react-bootstrap';

interface PostCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    posts: Populated<Post>[];
    className?: string;
}

export const PostCardGrid: React.FC<PostCardGridProps> = (props) => {
    const { title, posts, className } = props;
    const [selectedIdForDetails, setSelectedIdForDetails] = useState<string | null>(null);

    const onViewDetails = (id: string) => {
        setSelectedIdForDetails(id);
    };

    const onHideDetails = () => {
        setSelectedIdForDetails(null);
    };

    if (posts.length === 0) {
        return null;
    }

    const selectedPostForDetails = posts.find((post) => {
        return post._id == selectedIdForDetails;
    });

    

    return (
        <React.Fragment>
            <div className={`post-card-grid ${className} neon-border`}>
                <h1>{title}</h1>
                <Row>
                    {posts.map((post, i) => {
                        return (
                            <Col key={i} className="mb-3" sm={4} md={4}>
                                <PostCard post={post} onViewDetails={onViewDetails} />
                            </Col>
                        );
                    })}
                </Row>
            </div>
            {selectedPostForDetails && <PostCardDetailModal onHide={onHideDetails} post={selectedPostForDetails} />}
        </React.Fragment>
    );
};
