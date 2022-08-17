import React, { useLayoutEffect, useState } from 'react';

import './PostCardDetailModal.scss';

import $ from 'jquery';
import 'bootstrap';
import { FrontFace } from './FrontFace';
import { BackFace } from './BackFace';
import { Populated, Post } from '@drill-down/interfaces';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createComment, deletePost } from '../../store';

interface PostCardDetailModalProps {
    post: Populated<Post>;
    onHide: () => any;
}
export const PostCardDetailModal: React.FC<PostCardDetailModalProps> = (props) => {
    const { post, onHide } = props;
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const dispatch = useDispatch();

    // Since we're opening the modal manually, we need to do it before the render
    useLayoutEffect(() => {
        const modal = $('#post-card-detail-modal') as any;
        modal.on('hidden.bs.modal', function () {
            onHide();
        });

        modal.modal('show');

        return function cleanup() {
            handleHide();
        };
    }, [post]);

    useEffect(() => {
        if (isFlipped) {
            $('.flipper').addClass('flip');
        } else {
            $('.flipper').removeClass('flip');
        }
    }, [isFlipped]);

    const handleHide = () => {
        // When closing manually, we need to get rid of the backdrop
        const modal = $('#post-card-detail-modal') as any;
        modal.modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        onHide();
    };

    const handleCommentCreated = (comment: { postId: string; message: string; replyTo: string | null }): void => {
        dispatch(createComment(comment));
    };

    const handlePostStarred = () => {};

    const handleEdit = () => {
        // TODO:
    };

    const handleDelete = () => {
        dispatch(deletePost(post._id));
    };

    const togglePostCardFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (!post) {
        return null;
    }

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
                            postId={post._id}
                            onHide={handleHide}
                            onPostCardFlip={togglePostCardFlip}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        <BackFace
                            postId={post._id}
                            onPostCardFlip={togglePostCardFlip}
                            onCommentCreated={handleCommentCreated}
                            onPostStarred={handlePostStarred}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
