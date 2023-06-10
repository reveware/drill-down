import React, {useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CreateQuotePost } from '@drill-down/interfaces';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from 'src/store';
import { Button, Form } from 'react-bootstrap';
import { TagList } from 'src/components';
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
        tags: [],
        description: '',
        author: '' || loggedInUser.username,
        quote: '',
        date: new Date(),
        location: undefined,
    };

    return (
        <Formik validationSchema={QuotePostSchema} initialValues={initialValues} onSubmit={onSubmit} validateOnMount={true}>
            {({ values, errors, handleSubmit, isValid, setFieldValue }) => (
                <div>
                    <Form>
                        <div className="inputs">
                            <Form.Group controlId="author">
                                <Form.Label>Author</Form.Label>
                            </Form.Group>

                            <Form.Group controlId="quote">
                                <Form.Label>Quote</Form.Label>
                            </Form.Group>

                            <Form.Group controlId="location">
                                <Form.Label>Where?</Form.Label>
                            </Form.Group>

                            <Form.Group controlId="date">
                                <Form.Label>When?</Form.Label>
                            </Form.Group>
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
                                        suggestions: [], // TODO: bring back suggestions
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
                            <Button type="button" variant="dark" onClick={() => handleSubmit()} disabled={!isValid}>
                                Create Photo Post
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};
