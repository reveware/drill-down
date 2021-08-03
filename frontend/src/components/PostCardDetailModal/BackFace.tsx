import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik, FormikValues } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PostCardDetailModal.scss';
import { Post, Comment, Populated } from '@drill-down/interfaces';
import { CommentsList } from '../Comments/CommentsList';
import { useDispatch } from 'react-redux';
import { createComment } from '../../store';
import { history } from '../../App';
import { AppRoutes } from '../../Routes';

interface BackFaceProps {
    post: Populated<Post>;
    onPostCardFlip: () => any;
}

export const BackFace: React.FC<BackFaceProps> = (props) => {
    const { post, onPostCardFlip } = props;
    const dispatch = useDispatch();

    const [replyingTo, setReplyingTo] = useState<Populated<Comment> | null>(null);

    const handleCommentSubmit = (message: string) => {
        const comment = {
            postId: post._id,
            replyTo: replyingTo ? replyingTo._id : null,
            message,
        };

        dispatch(createComment(comment));
    };

    const handlePostStarred = () => {
        alert('post liked');
    };

    const CommentSchema = Yup.object().shape({
        message: Yup.string().min(3, 'Must be at least 3 characters long').required(),
    });

    return (
        <div className="back">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="header-icons">
                        <FontAwesomeIcon className="pointer" icon="forward" size="lg" onClick={onPostCardFlip} />
                    </div>
                </div>
                <div className="modal-body">
                    <div className="back-face-body">
                        <CommentsList
                            comments={post.comments as Populated<Comment>[]}
                            onLeaveReplyClick={(comment: Populated<Comment>) => {
                                setReplyingTo(comment);
                            }}
                            onAuthorClick={(author: string) => {
                              history.push(AppRoutes.USER_PROFILE.replace(':username', author))
                            }}
                        />

                        <div className="leave-a-comment">
                            <Formik onSubmit={() => {}} validationSchema={CommentSchema} validateOnMount initialValues={{ message: '' }}>
                                {(props: FormikValues) => {
                                   const { values, errors, handleChange, handleBlur, isValid, touched, resetForm } = props;
                                 return (
                                    <Form
                                        noValidate
                                        onSubmit={(e: React.FormEvent) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}>
                                        <Form.Group controlId="message">
                                            <Form.Label>
                                                {replyingTo ? `Replying to ${replyingTo.author.username}` : 'Leave a comment!'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                as="textarea"
                                                rows={2}
                                                value={values.message}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={!!errors.message && touched.message}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                                            <Button
                                                type="text"
                                                className="mt-1"
                                                variant="dark"
                                                block
                                                onClick={() => {
                                                    handleCommentSubmit(values.message);
                                                    resetForm();
                                                }}
                                                disabled={!isValid}>
                                                Leave comment
                                            </Button>
                                        </Form.Group>
                                    </Form>
                                )}}
                            </Formik>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="footer-origin-info">
                        <span>{`Starred ${post.stars.length} times`}</span>
                    </div>
                    <FontAwesomeIcon className="pointer" icon={['far', "star"]} size="lg" onClick={handlePostStarred} />
                </div>
            </div>
        </div>
    );
};
