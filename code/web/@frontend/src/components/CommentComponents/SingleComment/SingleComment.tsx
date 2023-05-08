import React, { useState } from 'react';
import { Image, Collapse } from 'react-bootstrap';
import { Comment } from '@drill-down/interfaces';
import { TextBox } from '../../../components';
import _ from 'lodash';
import './SingleComment.scss';
import moment from 'moment';
import { Values } from '@drill-down/constants';

interface SingleCommentProps {
    comment: Comment;
    allComments: Comment[];
    onAuthorClick: (author: string) => any;
    onLeaveReplyClick: (comment: Comment) => any;
}
export const SingleComment: React.FC<SingleCommentProps> = (props) => {
    const { comment, allComments, onLeaveReplyClick, onAuthorClick } = props;

    const replies = _.filter(allComments, (possibleReply) => possibleReply.reply_to === comment.id);
    const [isShowingReplies, setIsShowingReplies] = useState<boolean>(replies.length <= 3);

    return (
        <React.Fragment>
            <div className="single-comment">
                <div className="comment-avatar">
                    <Image
                        onClick={() => {
                            onAuthorClick(comment.author.username);
                        }}
                        className="d-block w-100 h-100"
                        src={comment.author.avatar}
                        rounded
                    />
                </div>
                <div className="comment-content">
                    <div className="comment-content-header">
                        <span
                            className="comment-author pointer"
                            onClick={() => {
                                onAuthorClick(comment.author.username);
                            }}>
                            {comment.author.username}
                        </span>
                        <span className="text-muted">{moment(comment.created_at).format(Values.DATE_TIME_FORMAT)}</span>
                    </div>

                    <TextBox className={'comment-message'} text={comment.message} maxLength={150} />

                    <div>
                        {replies.length > 0 && (
                            <span
                                onClick={() => {
                                    setIsShowingReplies(!isShowingReplies);
                                }}
                                className="text-muted show-hide-replies">
                                {isShowingReplies ? 'Hide replies' : 'Show replies'}
                            </span>
                        )}
                        <button
                            onClick={() => {
                                onLeaveReplyClick(comment);
                            }}
                            className="comment-reply-button button-as-link">
                            reply
                        </button>
                    </div>

                    <div className="comment-replies">
                        <Collapse in={isShowingReplies}>
                            <div>
                                {replies.map((reply) => (
                                    <SingleComment
                                        key={reply.id}
                                        comment={reply}
                                        allComments={allComments}
                                        onAuthorClick={onAuthorClick}
                                        onLeaveReplyClick={onLeaveReplyClick}
                                    />
                                ))}
                            </div>
                        </Collapse>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
