import React from 'react';
import {Card} from 'react-bootstrap';
import moment from 'moment';
import {PhotoPost, Post as PostType, PostTypes} from "@drill-down/interfaces";
import './Post.scss';


interface PostProps {
    post: PostType;
}

export const Post: React.FC<PostProps> = (props) => {
    const { post } = props;


    const getTags = (): string => {
        return (post.tags || []).map((tag)=>`#${tag}` ).join(', ').toUpperCase()
    }

    const getCreatedAt = (): string => {
        return moment.unix((post.createdAt || 0)).format('LLL')
    }
    return (
        <div className="post">
            <Card className="post-card">
                {
                    post.type === PostTypes.PHOTO ? (

                        <Card.Img
                            variant="top"
                            className="post-card-img"
                            src={(props.post.body as PhotoPost).urls[0] || "https://66.media.tumblr.com/ce59da0b36a695b698e5df2976e0f180/tumblr_pedwbdEEbq1wa84xco1_500.jpg"}
                        />

                    ) : `${JSON.stringify(post)}`
                }
                <div className="m-1">
                    <span className="post-card-tags text-muted">{getTags()}</span>

                    <div className="post-card-detail">
                        <span>{getCreatedAt()}</span>
                        <span>
                            <a href="#">View</a>
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
};
