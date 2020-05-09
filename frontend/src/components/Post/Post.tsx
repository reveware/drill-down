import React from 'react';
import { Card } from 'react-bootstrap';
import './Post.scss';
import { User } from '../../../../interfaces';

interface PostProps {
    user?: User;
    post: any;
}

export const Post: React.FC<PostProps> = (props) => {
    return (
        <div className="post">
            <Card className="post-card">
                <Card.Img
                    variant="top"
                    className="post-card-img"
                    src="https://66.media.tumblr.com/ce59da0b36a695b698e5df2976e0f180/tumblr_pedwbdEEbq1wa84xco1_500.jpg"
                />

                <div className="m-1">
                    <span className="post-card-tags text-muted">#Movie, #Quentin Tarantino, #Inception</span>

                    <div className="post-card-detail">
                        <span>13/01/2031</span>
                        <span>
                            <a href="#">View</a>
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
};
