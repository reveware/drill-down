import React, { useEffect } from 'react';
import { Post } from '..';
import { Col, Row } from 'react-bootstrap';
import './PostGrid.scss';

interface PostGridProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    title: string;
    posts: any[];
}

export const PostGrid: React.FC<PostGridProps> = (props) => {
    const { title, posts, id, className } = props;

    const setRandomColorBorderLight = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const div = document.getElementById(id);
        if (div) {
            div.style.boxShadow = `-13px -13px 20px -20px #${randomColor}`;
        }
    };
    useEffect(setRandomColorBorderLight, []);

    return (
        <div id={id} className={`post-grid ${className}`}>
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
