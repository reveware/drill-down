import { Formik } from 'formik';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import * as images from '../../../assets/img'
import { Validation, Values } from '@drill-down/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Yup from 'yup';
import { CreateUser, UserRole } from '@drill-down/interfaces';
import moment from 'moment';
import { Avatar, DatePicker, Button } from 'src/components/';
import './RegisterForm.scss';

interface RegisterFormProps {
    onSubmit: (formValues: CreateUser.Request) => void;
    onCancel: () => void;
    className?: string;

}
export const RegisterForm: React.FC<RegisterFormProps> = (props) => {
    const { onSubmit, onCancel } = props;
    const className = props.className || 'register-form'

    const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
    const [avatarSource, setAvatarSource] = useState<string>(images.MaleAvatar);
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);

    const validations: { [key in keyof CreateUser.Request]: any } = {
        first_name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('First name is required'),
        last_name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('Last name is required!'),
        username: Yup.string().min(2, 'Too short!').max(20, 'Too Long!').required('Username is required!'),
        avatar: Yup.mixed().required('Avatar is required'),
        email: Yup.string().email('Must be a valid email').required('Email is required!'),
        password: Yup.string().min(9, 'Must be at least 9 characters').required('Password cannot be empty'),
        tagline: Yup.string().min(2).required('A tagline is required!'),
        date_of_birth: Yup.date()
            .max(moment().subtract(18, 'years').toDate(), 'Must be at least 18')
            .required('Date of birth is required!'),
        role: Yup.string().required('A role is required'),
    };

    const registerSchema = Yup.object().shape(validations);

    const initialValues = {
        avatar: null as any,
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        tagline: '',
        date_of_birth: undefined,
        role: UserRole.USER,
    };
    const handleShowPasswordToggle = () => {
        setIsShowingPassword(!isShowingPassword);
    };

    const handleAvatarPhotoChange = (e: React.ChangeEvent<any>): File | undefined => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    setAvatarSource(reader.result.toString());
                }
            };

            if (Validation.isValidImageMime(file.type)) {
                return file;
            }
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleFormSubmit = async (values: { [key in keyof CreateUser.Request]: any }) => {
        const user = {
            ...values,
            date_of_birth: moment(values.date_of_birth).startOf('day').toISOString(),
        };

        onSubmit(user);
    };

    return (
        <div className={className}>
            <Formik initialValues={initialValues} validationSchema={registerSchema} onSubmit={handleFormSubmit} validateOnMount={true}>
                {({ isValid, values, errors, handleChange, handleBlur, setFieldValue, handleSubmit }) => (
                    <Form>
                        <Row>
                            <Col>
                                <div className="register-avatar">
                                    <label htmlFor="avatar-file" className="register-avatar-photo">
                                        <Avatar source={avatarSource} type="circle" border={false} />
                                    </label>
                                    <Form.Group>
                                        <Form.Label>Avatar</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="avatar"
                                            accept={Values.IMAGE_MIME}
                                            id="avatar-file"
                                            className="avatar-file"
                                            onBlur={handleBlur}
                                            onChange={(e) => setFieldValue('avatar', handleAvatarPhotoChange(e), true)}
                                        />
                                    </Form.Group>
                                    <Form.Text className={`text-center form-hint ${isMouseOverSubmit && errors.avatar ? '' : 'invisible'}`}>
                                        {errors.avatar as string}
                                    </Form.Text>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && errors.username ? '' : 'invisible'}`}>
                                        {errors.username}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="first-name">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="first_name"
                                        placeholder="Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && errors.first_name ? '' : 'invisible'}`}>
                                        {errors.first_name}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="last-name">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="last_name"
                                        placeholder="Last Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && errors.last_name ? '' : 'invisible'}`}>
                                        {errors.last_name}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" name="email" placeholder="Email" onChange={handleChange} onBlur={handleBlur} />
                            <Form.Text className={`form-hint ${isMouseOverSubmit && errors.email ? '' : 'invisible'}`}>
                                {errors.email}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name="password"
                                    type={isShowingPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <InputGroup.Text>
                                    <FontAwesomeIcon
                                        onClick={handleShowPasswordToggle}
                                        icon={isShowingPassword ? 'eye-slash' : 'eye'}
                                        size="lg"
                                    />
                                </InputGroup.Text>
                            </InputGroup>
                            <Form.Text className={`form-hint ${isMouseOverSubmit && errors.password ? '' : 'invisible'}`}>
                                {errors.password}
                            </Form.Text>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group controlId="dateOfBirth">
                                    <Form.Label>Date Of Birth</Form.Label>
                                    <DatePicker
                                        date={values.date_of_birth}
                                        onChange={(date) => {
                                            return setFieldValue('date_of_birth', date, true);
                                        }}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && errors.date_of_birth ? '' : 'invisible'}`}>
                                        {errors.date_of_birth as string}
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="tagline">
                                    <Form.Label>Tag Line</Form.Label>
                                    <Form.Control
                                        name="tagline"
                                        type="text"
                                        placeholder="Slow down"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && errors.tagline ? '' : 'invisible'}`}>
                                        {errors.tagline}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="register-form-buttons">
                            {/* Disabled buttons don't emit events, so wrap it around span */}
                            <span>
                                <Button label='Cancel' variant="secondary" onClick={handleCancel}/>
                            </span>

                            <span
                                onMouseEnter={() => {
                                    setIsMouseOverSubmit(true);
                                }}
                                onMouseLeave={() => {
                                    setIsMouseOverSubmit(false);
                                }}>
                                    <Button label='Register' variant='primary' disabled={!isValid} onClick={handleSubmit}/>
                            </span>
                        </div>

                        <div className="register-options">
                        <p className="text-muted text-center">Or register with:</p>
                        <hr />
                    </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
