import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CreateQuotePost } from '@drill-down/interfaces';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from 'src/store';
import { Form } from 'react-bootstrap';
import { TagList, DatePicker, Button } from 'src/components';
import './CreateQuotePostForm.scss';

interface CreateQuotePostFormProps {
    onSubmit: (post: CreateQuotePost.Request) => void;
}
export const CreateQuotePostForm: React.FC<CreateQuotePostFormProps> = (props) => {
    const { onSubmit } = props;

    const loggedInUser = useSelector(selectLoggedInUser);
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);

    if (!loggedInUser) {
        return null;
    }

    const validations: { [key in keyof CreateQuotePost.Request]: any } = {
        author: Yup.string().required(),
        quote: Yup.string().required(),
        date: Yup.date().optional(),
        location: Yup.string().optional(),
        description: Yup.string().optional(),
        tags: Yup.array().min(1, 'At least 1 tag is required'),
    };

    const QuotePostSchema = Yup.object().shape(validations);

    const initialValues = {
        author: '' || loggedInUser.username,
        quote: '',
        date: undefined,
        location: undefined,
        tags: [],
        description: '',
    };

    return (
        <Formik validationSchema={QuotePostSchema} initialValues={initialValues} onSubmit={onSubmit} validateOnMount={true}>
            {({ values, errors, handleSubmit, handleChange, handleBlur, isValid, setFieldValue }) => (
                <div className="create-quote-post-form">
                    <Form>
                        <div className="inputs">
                            <Form.Group controlId="author">
                                <Form.Label>Author</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="author"
                                    value={values.author}
                                    placeholder="Michelangelo"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                            <Form.Text className={`form-hint ${isMouseOverSubmit && errors.author ? '' : 'invisible'}`}>
                                    {errors.author}
                                </Form.Text>

                            <Form.Group controlId="quote">
                                <Form.Label>Quote</Form.Label>
                                <Form.Control
                                    type="text"
                                    as="textarea"
                                    name="quote"
                                    value={values.quote}
                                    placeholder="I saw the angel in the marvel and I carved until I set him free"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                            <Form.Text className={`form-hint ${isMouseOverSubmit && errors.quote ? '' : 'invisible'}`}>
                                    {errors.quote}
                                </Form.Text>

                            <div className="quote-details">
                                <Form.Group controlId="location">
                                    <Form.Label>Where?</Form.Label>
                                    <Form.Control
                                        type="select"
                                        name="location"
                                        placeholder="Italy"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>

                                <Form.Group controlId="date">
                                    <Form.Label>When?</Form.Label>
                                    <DatePicker
                                        date={values.date}
                                        onChange={(date) => {
                                            return setFieldValue('date', date, true);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div>
                            <Form.Group controlId="tags">
                                <Form.Label>Tags</Form.Label>
                                <TagList
                                    tags={values.tags}
                                    edit={{
                                        onChange: (tags) => {
                                            setFieldValue('tags', tags);
                                        },
                                        suggestions: [], // TODO: bring back suggestions (https://trello.com/c/89C9hFwj)
                                    }}
                                />
                                <Form.Text className={`form-hint ${isMouseOverSubmit && errors.tags ? '' : 'invisible'}`}>
                                    {errors.tags}
                                </Form.Text>
                            </Form.Group>
                        </div>

                        <div
                            className="create-quote-post-button"
                            onMouseEnter={() => setIsMouseOverSubmit(() => true)}
                            onMouseLeave={() => setIsMouseOverSubmit(() => false)}>
                            <Button label='Create Quote Post' variant="primary" onClick={() => handleSubmit()} disabled={!isValid}/>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};
