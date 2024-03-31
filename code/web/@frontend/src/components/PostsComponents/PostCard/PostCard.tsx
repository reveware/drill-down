import React from 'react';
import Card from 'react-bootstrap/Card';
import { QuotePost } from './QuotePost/QuotePost';
import { PostOverview, PostTypes, UserRole } from '@drill-down/interfaces';

import moment from 'moment';
import './PostCard.scss';

import { TagList } from 'src/components';
import { selectLoggedInUser, useAppSelector } from 'src/store';

interface PostCardProps {
    post: PostOverview;
    onClick: (post: PostOverview) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const PostCard: React.FC<PostCardProps> = (props: PostCardProps) => {
    const { post, onClick, size } = props;
    const loggedInUser = useAppSelector(selectLoggedInUser);

    const isAdmin = () => {
        return loggedInUser?.role === UserRole.ADMIN;
    };
    
    const formaToRelativeDate = (date: Date): string => {
        return moment(date).fromNow();
    };

    const renderCardContent = (post: PostOverview) => {
        const type = post.type;
        if(type == PostTypes.PHOTO) {
            const url = post.content.urls[0];
            return <Card.Img variant="top" className="post-card-img" src={url} />
        }
        if(type == PostTypes.QUOTE){
            return  <QuotePost variant="handwritting" post={post} />
        } 
        
        if(isAdmin()){ return JSON.stringify(post) }
    }

    return (
        <Card id={`post-card-${post.id}`} className={`post-card ${size ?? ''}`}>
            <div
                className="post-card-content"
                onClick={() => {onClick(post)}}>
                {renderCardContent(post)}
            </div>

            <div className="post-card-detail">
                <TagList className="post-card-tags" tags={post.tags} />
                <div className="post-card-meta">
                    <span>{formaToRelativeDate(post.created_at)}</span>
                </div>
            </div>
        </Card>
    );
};
