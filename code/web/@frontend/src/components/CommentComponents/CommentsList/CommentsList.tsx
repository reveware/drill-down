import React from 'react';
import { Comment } from '@drill-down/interfaces';
import * as _ from 'lodash';
import { SingleComment } from '../SingleComment/SingleComment';

import './CommentsList.scss';

interface CommentsListProps {
    comments: Comment[];
    onAuthorClick: (author: string) => void;
    onLeaveReplyClick: (comment: Comment) => void;
}
export const CommentsList: React.FC<CommentsListProps> = (props) => {
    const { comments, onAuthorClick, onLeaveReplyClick } = props;


    const firstLevelComments = _.filter(comments, (comment) => _.isNil(comment.reply_to));
    
    return (
        <div id="comments-list" className="comments-list">
            {firstLevelComments.map((comment, i) => {
                return (
                    <SingleComment
                        key={i}
                        comment={comment}
                        allComments={comments}
                        onAuthorClick={onAuthorClick}
                        onLeaveReplyClick={onLeaveReplyClick}
                    />
                );
            })}
        </div>
    );
};
