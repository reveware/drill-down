import React, { useLayoutEffect, useState, useCallback } from 'react';
import $ from 'jquery';
import 'bootstrap';
import { FrontFace } from './FrontFace';
import { BackFace } from './BackFace';
import { CreateComment, PostOverview } from '@drill-down/interfaces';
import { useEffect } from 'react';
import {} from 'react-redux';
import './PostCardDetailModal.scss';
import { useCreateCommentMutation, useDeletePostMutation } from 'src/hooks';


interface PostCardDetailModalProps {
    post: PostOverview;
    onHide: () => void;
}

export const PostCardDetailModal: React.FC<PostCardDetailModalProps> = (props) => {
    const { post, onHide } = props;
    // TODO: handle loading, errors

    
    const [createComment] = useCreateCommentMutation();
    const [deletePost] = useDeletePostMutation();
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const handleHide = useCallback(() => {
        // When closing manually, we need to get rid of the backdrop
        const modal = $('#post-card-detail-modal') as any;
        modal.modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        onHide();
      }, [onHide]);

    const handleCommentCreated = (comment: CreateComment.Request): void => {
        createComment({ post: post.id, comment: comment });
    };

    const handlePostStarred = () => {
        alert('post liked');
    };

    const handleEdit = () => {
        // TODO:
    };

    const handleDelete = () => {
        deletePost({ id: post.id });
        handleHide();
    };

    const togglePostCardFlip = () => {
        setIsFlipped(!isFlipped);
    };


    // Since we're opening the modal manually, we need to do it before the render
    useLayoutEffect(() => {
        const modal = $('#post-card-detail-modal') as any;
        modal.on('hidden.bs.modal', function () {
            handleHide();
        });

        
        modal.modal('show');

        return function cleanup() {
            handleHide();
        };
    }, [post, handleHide]);

    useEffect(() => {
        if (isFlipped) {
            $('.flipper').addClass('flip');
        } else {
            $('.flipper').removeClass('flip');
        }
    }, [isFlipped]);


    return (
        <React.Fragment>
            <div
                className="modal"
                id="post-card-detail-modal"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="Post detail modal"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
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
                            onStarPost={handlePostStarred}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
