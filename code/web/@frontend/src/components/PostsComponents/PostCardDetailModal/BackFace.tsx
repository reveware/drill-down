import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PostCardDetailModal.scss';
import { CommentsList, CreateCommentForm, Loading } from '../../../components';
import { useGetPostDetailQuery } from '../../../hooks';
import { history } from '../../../App';
import { AppRoutes } from '../../../Routes';
import { CreateComment, Comment, PostOverview } from '@drill-down/interfaces';

interface BackFaceProps {
    post: PostOverview;
    onFlipPostCard: () => void;
    onStarPost: () => void;
    onCreateComment: (comment: CreateComment.Request) => void;
}

export const BackFace: React.FC<BackFaceProps> = (props) => {
    const { post, onFlipPostCard, onCreateComment, onStarPost } = props;
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

    const { data: postDetail, isLoading: isLoadingDetails } = useGetPostDetailQuery({ id: post.id });

    return (
        <div className="back">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="header-actions">
                        <FontAwesomeIcon className="pointer" icon="forward" size="sm" onClick={onFlipPostCard} />
                    </div>
                </div>
                <div className="modal-body">
                    {isLoadingDetails && <Loading />}

                    {!isLoadingDetails && postDetail && (
                        <div className="back-face">
                            <CommentsList
                                comments={postDetail.comments}
                                onLeaveReplyClick={setReplyingTo}
                                onAuthorClick={(author: string) => {
                                    history.push(AppRoutes.USER_PROFILE.replace(':username', author));
                                }}
                            />
                            <CreateCommentForm replyTo={replyingTo} onSubmit={onCreateComment} />
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <div className="footer-origin-info">
                        <span>{`Starred ${postDetail?.likes.length || ''} times`}</span>
                    </div>
                    <FontAwesomeIcon className="pointer" icon={['far', 'star']} size="sm" onClick={onStarPost} />
                </div>
            </div>
        </div>
    );
};
