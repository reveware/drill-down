import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CustomPhotosInput, TagList, TagListProps } from '../../components';
import { Button, Form } from 'react-bootstrap';
import { createPhotoPost } from '../../store';

export const CreatePhotoPostForm: React.FC<{ tagListProps: TagListProps }> = (props) => {
    const { tagListProps } = props;
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);
    const dispatch = useDispatch();

    const PhotoPostSchema = Yup.object().shape({
        photos: Yup.array().required().min(1, 'At least one photo is required'),
        description: Yup.string().optional(),
        tags: Yup.array(),
    });

    const handleSubmit = async (values: any) => {
        const { photos, description } = values;
        dispatch(createPhotoPost({ photos, description, tags: tagListProps.tags }));
    };

    return (
        <Formik
            validationSchema={PhotoPostSchema}
            initialValues={{ photos: [], description: undefined, tags: [] }}
            initialErrors={{ photos: 'Please, select at least 1 photo' }}
            onSubmit={(e) => {
                handleSubmit(e);
            }}>
            {({ values, errors, handleChange, submitForm, setFieldValue, isValid }) => (
                <div>
                    <p className="text-muted">Upload photos and tag them appropiately to be able to backtrack to them later 🌚 </p>
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
                            <Form.Control type="text" as="textarea" rows={3} value={values.description} onChange={handleChange} />

                            <Form.Text className={`form-hint ${isMouseOverSubmit && errors.description ? '' : 'invisible'}`}>
                                {errors.description}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <TagList tags={tagListProps.tags} editOptions={tagListProps.editOptions} />
                        </Form.Group>

                        <div onMouseEnter={() => setIsMouseOverSubmit(() => true)} onMouseLeave={() => setIsMouseOverSubmit(() => false)}>
                            <Button type="button" variant="dark" size="lg" onClick={submitForm} disabled={!isValid}>
                                Create Photo Post
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
};
