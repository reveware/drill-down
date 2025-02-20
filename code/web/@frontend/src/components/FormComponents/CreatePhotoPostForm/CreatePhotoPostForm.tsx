import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CustomPhotosInput, HintMessage, TagList, Button } from '../../../components';
import { Form } from 'react-bootstrap';

import { CreatePhotoPost } from '@drill-down/interfaces';
import './CreatePhotoPostForm.scss';

interface CreatePhotoPostFormProps {
    onSubmit: (values: CreatePhotoPost.Request) => void;
}
export const CreatePhotoPostForm: React.FC<CreatePhotoPostFormProps> = (props) => {
    const { onSubmit } = props;

    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);

    const validations: { [key in keyof CreatePhotoPost.Request]: any } = {
        photos: Yup.array().required().min(1, 'At least one photo is required'),
        description: Yup.string().optional(),
        tags: Yup.array().min(1, 'At least 1 tag is required'),
    };
    const PhotoPostSchema = Yup.object().shape(validations);

    const initialValues = { photos: [], description: undefined, tags: [] };

    return (
        <Formik validationSchema={PhotoPostSchema} initialValues={initialValues} validateOnMount={true} onSubmit={onSubmit}>
            {({ values, errors, handleChange, handleSubmit, setFieldValue, isValid }) => (
                <div>
                    <div className="create-photo-post-form">
                    <HintMessage message={`Upload photos and tag them appropiately to be able to backtrack to them later 🌚`}/>
                        <Form>
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
                                <Form.Control type="text" as="textarea" rows={3} value={values.description} onChange={handleChange} />

                                <Form.Text className={`form-hint ${isMouseOverSubmit && errors.description ? '' : 'invisible'}`}>
                                    {errors.description}
                                </Form.Text>
                            </Form.Group>

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

                            <div
                                className="create-photo-post-button"
                                onMouseEnter={() => setIsMouseOverSubmit(true)}
                                onMouseLeave={() => setIsMouseOverSubmit(false)}>
                                <Button label='Create Photo Post' variant="primary" onClick={() => handleSubmit()} disabled={!isValid}/>
                                
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </Formik>
    );
};
