import React from 'react';
import { PostCard } from '..';
import { Col, Row } from 'react-bootstrap';
import './PostCardGrid.scss';
import '../../index.scss';

interface PostCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    title: string;
    posts: any[];
}

export const PostCardGrid: React.FC<PostCardGridProps> = (props) => {
    const { title, posts, id, className } = props;

    if (posts.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            <div id={id} className={`post-card-grid ${className} neon-border`}>
                <h1>{title}</h1>
                <Row>
                    {posts.map((post, i) => {
                        return (
                            <Col key={i} className="mb-3" sm={4} md={4}>
                                <PostCard post={post} />
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </React.Fragment>
    );
};
