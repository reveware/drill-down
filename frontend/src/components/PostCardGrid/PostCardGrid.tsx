import React from 'react';
import { PostCard, PostCardDetailModal } from '..';
import { Col, Row } from 'react-bootstrap';
import './PostCardGrid.scss';
import '../../styles/index.scss';
import { useState } from 'react';
import { Populated, Post } from '@drill-down/interfaces';

interface PostCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    title: string;
    posts: Populated<Post>[];
}

export const PostCardGrid: React.FC<PostCardGridProps> = (props) => {
    const { title, posts, id, className } = props;
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
            <div id={id} className={`post-card-grid ${className} neon-border`}>
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
