import React from 'react';
import { Post } from '..';
import { Col, Row } from 'react-bootstrap';
import './PostGrid.scss';
import '../../index.scss'

interface PostGridProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    title: string;
    posts: any[];
}

export const PostGrid: React.FC<PostGridProps> = (props) => {
    const { title, posts, id, className } = props;

    return (
        <div id={id} className={`post-grid ${className} neon-border`}>
            <h1>{title}</h1>
            <Row>
                {posts.map((post, i) => {
                    return (
                        <Col key={i} className="mb-3" sm={4} md={4}>
                            <Post post={post} />
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};
