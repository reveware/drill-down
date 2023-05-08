import React, { useEffect } from 'react';
import { PostOverview, PostTypes } from '@drill-down/interfaces';
import { Values } from '@drill-down/constants';
import { Card } from 'react-bootstrap';
import moment from 'moment';
import './PostCardBanner.scss';
import { TagList } from '../../../components';

interface PostCardBannerdProps {
    title: string;
    post: PostOverview;
}

export const PostCardBanner: React.FC<PostCardBannerdProps> = (props) => {
    const { title, post } = props;

    useEffect(() => {
        const imgOverlay = document.getElementById('post-card-banner');
        if (imgOverlay && post.type === PostTypes.PHOTO) {
            imgOverlay.style.backgroundImage = `url(${post.content.urls[0]})`;
        }
    }, [post]);

    if (!post || post.type !== PostTypes.PHOTO) {
        return null;
    }

    return (
        <React.Fragment>
            <Card>
                <div id="post-card-banner" className="post-card-banner" />
                <Card.ImgOverlay>
                    <div className="post-card-banner-img-overlay">
                        <Card.Title className="post-card-banner-title">{title}</Card.Title>
                        <div className="post-card-banner-footer">
                            <p>{moment(post.created_at).format(Values.DATE_TIME_FORMAT)}</p>
                            <TagList tags={post.tags} />
                        </div>
                    </div>
                </Card.ImgOverlay>
            </Card>
        </React.Fragment>
    );
};
