import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Card, Container, Form, Tab, Tabs, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { PostTypes } from '@drill-down/interfaces';
import * as _ from 'lodash';
import './CreatePost.scss';
import { TagList, CustomPhotosInput } from '../../components';

import { AppState } from '../../store';
import { createPhotoPost } from '../../store/actions';

export const CreatePost: React.FC = () => {
    const postsCountByTag = useSelector((state: AppState) => state.posts.postCountByTag);
    const suggestions = _.map(postsCountByTag, (count) => count.tag).slice(0, 30);

    const [tags, setTags] = useState<string[]>([]);
    const [tagSuggestions, setTagSuggestions] = useState<string[]>(suggestions);
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);

    const dispatch = useDispatch();

    const PhotoPostSchema = Yup.object().shape({
        photos: Yup.array().required().min(1, 'At least one photo is required'),
        description: Yup.string().min(10, 'Must be at least 10 characters long'),
        tags: Yup.array(),
    });

    const handleSubmit = async (values: any) => {
        // manually build multi-part form
        const formData = new FormData();
        values.photos.forEach((file: File) => {
            formData.append('photos', file, file.name);
        });
        formData.append('description', values.description);
        formData.append('tags', tags.join(',')); // multi-part form does't support arrays

        dispatch(createPhotoPost(formData));
    };

    const handleTagAdded = (tag: string) => {
        setTags(_.uniq([...tags, tag]));
    };

    const handleTagDeleted = (tag: string, index: number) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
    };

    const handleTagSuggestionClicked = (tag: string, index: number) => {
        const updatedSuggestions = [...tagSuggestions];
        updatedSuggestions.splice(index, 1);
        setTagSuggestions(updatedSuggestions);
        handleTagAdded(tag);
    };

    return (
        <React.Fragment>
            <Container>
                <Card.Title>Create New Post</Card.Title>
                <Tabs defaultActiveKey={PostTypes.PHOTO}>
                    <Tab eventKey={PostTypes.PHOTO} title="Photo">
                        <Formik
                            validationSchema={PhotoPostSchema}
                            initialValues={{ photos: [], description: '', tags: [] }}
                            initialErrors={{ photos: 'Please, select at least 1 photo' }}
                            onSubmit={(e) => {
                                handleSubmit(e);
                            }}>
                            {({ values, errors, handleChange, submitForm, setFieldValue, isValid }) => (
                                <Card className="create-post-card">
                                    <Card.Body>
                                        <p className="text-muted">
                                            Upload photos and tag appropiately to be able to backtrack to them later 🌚{' '}
                                        </p>
                                        <Form
                                            noValidate
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}>
                                            <Form.Group controlId="photos">
                                                <Form.Label>Photos (or GIFS!)</Form.Label>
                                                <CustomPhotosInput
                                                    onPhotosChanged={(files) => {
                                                        setFieldValue('photos', files);
                                                    }}
                                                />

                                                <Form.Text className={`form-hint ${isMouseOverSubmit && errors.photos ? '' : 'invisible'}`}>
                                                    {errors.photos}
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group controlId="description">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    as="textarea"
                                                    rows={3}
                                                    value={values.description}
                                                    onChange={handleChange}
                                                />

                                                <Form.Text
                                                    className={`form-hint ${isMouseOverSubmit && errors.description ? '' : 'invisible'}`}>
                                                    {errors.description}
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group controlId="tags">
                                                <Form.Label>Tags</Form.Label>
                                                <TagList
                                                    tags={tags}
                                                    editOptions={{
                                                        onTagAdded: handleTagAdded,
                                                        onTagDeleted: handleTagDeleted,
                                                        suggestions: tagSuggestions,
                                                        onSuggestionClicked: handleTagSuggestionClicked,
                                                    }}
                                                />
                                            </Form.Group>

                                            <div
                                                onMouseEnter={() => setIsMouseOverSubmit(() => true)}
                                                onMouseLeave={() => setIsMouseOverSubmit(() => false)}>
                                                <Button type="text" variant="dark" block onClick={submitForm} disabled={!isValid}>
                                                    Create Photo Post
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            )}
                        </Formik>
                    </Tab>
                    <Tab eventKey={PostTypes.QUOTE} title="Quote"></Tab>
                </Tabs>
            </Container>
        </React.Fragment>
    );
};
