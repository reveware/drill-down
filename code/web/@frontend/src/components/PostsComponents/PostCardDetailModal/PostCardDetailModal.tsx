import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FrontFace } from './FrontFace';
import { BackFace } from './BackFace';
import { CreateComment, PostOverview } from '@drill-down/interfaces';
import { useEffect } from 'react';
import './PostCardDetailModal.scss';
import { useCreateCommentMutation, useDeletePostMutation } from 'src/hooks';


interface PostCardDetailModalProps {
    post: PostOverview;
    onHide: () => void;
}

export const PostCardDetailModal: React.FC<PostCardDetailModalProps> = (props) => {
    const { post, onHide } = props;
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    
    // TODO: handle loading, errors (https://trello.com/c/YZby4Xz9)
    const [createComment] = useCreateCommentMutation();
    const [deletePost] = useDeletePostMutation();

    const handleHide = () => {
        setIsOpen(false)
        onHide();
    }

    const handleCommentCreated = (comment: CreateComment.Request): void => {
        console.log('comment created', {comment})
        createComment({ post: post.id, comment: comment });
    };

    const handlePostLiked = () => {
        // TODO: create like flow // https://trello.com/c/YZby4Xz9 (https://trello.com/c/tenhlYA7)
    };

    const handleEdit = () => {
        // TODO: create a edit flow (https://trello.com/c/YZby4Xz9) (https://trello.com/c/bFDcv4DM) 
    };

    const handleDelete = () => {
        deletePost({ id: post.id });
        handleHide();
    };

    const togglePostCardFlip = () => {
        setIsFlipped(!isFlipped);
    };


    useEffect(() => {
        const flipperElement = document.querySelector('.flipper') as HTMLElement | null;
        if (isFlipped) {
            flipperElement?.classList.add('flip');
        } else {
            flipperElement?.classList.remove('flip');
        }
    }, [isFlipped]);


    return (
        <Modal show={isOpen} onHide={handleHide}>
        <div className="flipper">
            <FrontFace
                post={post}
                onHide={handleHide}
                onPostCardFlip={togglePostCardFlip}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <BackFace
                post={post}
                onFlipPostCard={togglePostCardFlip}
                onCreateComment={handleCommentCreated}
                onStarPost={handlePostLiked}
            />
        </div>
</Modal>     
    );
};
