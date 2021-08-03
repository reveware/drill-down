import React, { useEffect } from 'react';
import { PhotoPost, Post } from '@drill-down/interfaces';
import { Card } from 'react-bootstrap';
import moment from 'moment';
import './PostCardBanner.scss';
import { TagList } from '..';

interface PostCardBannerdProps {
    title: string;
    post: Post;
}

export const PostCardBanner: React.FC<PostCardBannerdProps> = (props) => {
    const { title, post } = props;

    if (!post) {
        return null;
    }

    useEffect(() => {
        const imgOverlay = document.getElementById('post-card-banner');
        if (imgOverlay) {
            imgOverlay.style.backgroundImage = `url(${(props.post.body as PhotoPost).urls[0]})`;
        }
    }, []);

    return (
        <React.Fragment>
            <Card>
                <div id="post-card-banner" className="post-card-banner" />
                <Card.ImgOverlay>
                    <div className="post-card-banner-img-overlay">
                        <Card.Title className="post-card-banner-title">{title}</Card.Title>
                        <div className="post-card-banner-footer">
                            <p>{moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            <TagList tags={post.tags} />
                        </div>
                    </div>
                </Card.ImgOverlay>
            </Card>
        </React.Fragment>
    );
};
