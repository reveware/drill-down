import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {Button} from '../../../components';
import { Comment, CreateComment } from '@drill-down/interfaces';
import './CreateCommentForm.scss';

interface CreateCommentFormProps {
    replyTo?: Comment | null;
    onSubmit: (comment: CreateComment.Request) => void;
}
export const CreateCommentForm: React.FC<CreateCommentFormProps> = (props) => {
    const { replyTo, onSubmit } = props;
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);
    const validations: { [key in keyof CreateComment.Request]: any } = {
        reply_to: Yup.number().optional(),
        message: Yup.string().min(3, 'Must be at least 3 characters long').required(),
    };

    const CommentSchema = Yup.object().shape(validations);

    const initialValues = {
        message: '',
    };

    return (
        <div className="create-comment-form">
            <Formik
                validationSchema={CommentSchema}
                initialValues={initialValues}
                validateOnMount={true}
                onSubmit={(values) => {
                    console.log('submitting comment', { values });
                    onSubmit({ ...values, reply_to: replyTo?.id || null });
                }}>
                {({ values, errors, handleChange, handleBlur, handleSubmit, isValid, resetForm }) => {
                    return (
                        <Form>
                            <Form.Group controlId="message">
                                <Form.Label>{replyTo ? `Replying to ${replyTo.author.username}` : 'Leave a comment!'}</Form.Label>
                                <Form.Control
                                    name="message"
                                    type="text"
                                    as="textarea"
                                    rows={2}
                                    value={values.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Text className={`form-hint ${isMouseOverSubmit && errors.message ? '' : 'invisible'}`}>
                                    {errors.message}
                                </Form.Text>
                                {/* Disabled buttons don't emit events, so wrap it around span */}
                                <span
                                    onMouseEnter={() => {
                                        setIsMouseOverSubmit(true);
                                    }}
                                    onMouseLeave={() => {
                                        setIsMouseOverSubmit(false);
                                    }}>
                                    <Button
                                        label='Leave comment'
                                        className="mt-1"
                                        variant="primary"
                                        onClick={() => {
                                            handleSubmit();
                                        }}
                                        disabled={!isValid}/>
                                </span>
                            </Form.Group>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};
