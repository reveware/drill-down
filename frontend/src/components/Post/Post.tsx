import React from 'react';
import { Card } from 'react-bootstrap';
import './Post.scss';

export const Post: React.FC = () => {
    return (
        <Card className="post-card mb-3">
            <Card.Img
                variant="top"
                className="post-card-img"
                src="https://66.media.tumblr.com/ce59da0b36a695b698e5df2976e0f180/tumblr_pedwbdEEbq1wa84xco1_500.jpg"
            />

            <Card.Footer>
                <div className="post-card-tags">
                    <span className="text-muted">#Movie, #Quentin Tarantino</span>
                </div>
                <div className="post-card-actions">
                    <span className="text-muted">13/01/2031</span>
                    <Card.Link href="#">Card Link</Card.Link>
                </div>
            </Card.Footer>
        </Card>
    );
};
