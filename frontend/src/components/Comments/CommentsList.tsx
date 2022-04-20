import React from 'react';
import { Comment, Populated } from '@drill-down/interfaces';
import * as _ from 'lodash';
import { SingleComment } from './SingleComment';

import './CommentsList.scss';
import { useEffect } from 'react';

interface CommentsListProps {
    comments: Populated<Comment>[];
    onAuthorClick: (author: string) => any;
    onLeaveReplyClick: (comment: Populated<Comment>) => any;
}
export const CommentsList: React.FC<CommentsListProps> = (props) => {
    const { comments, onAuthorClick, onLeaveReplyClick } = props;


    const firstLevelComments = _.filter(comments, (comment) => _.isNil(comment.replyTo));

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
