import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactDatePicker from 'react-datepicker';
import { AppRoutes } from '../../Routes';
import { Values, Validation } from '@drill-down/constants';
import 'react-datepicker/dist/react-datepicker.css';
import './Register.scss';
import { useCreateUserMutation } from 'src/hooks';

import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CreateUser, UserRole } from '@drill-down/interfaces';
import { useAppSelector, selectLoggedInUser } from '../../store/';
import { Avatar, Loading } from 'src/components';
import { ToastService } from 'src/services';
import * as Yup from 'yup';

export const Register = () => {
    const history = useHistory();
    const loggedInUser = useAppSelector((state) => selectLoggedInUser(state));
    const [createUser, { isLoading, error }] = useCreateUserMutation();

    const DEFAULT_AVATAR_PATH = '/images/male-avatar.png';

    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);
    const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
    const [avatarSource, setAvatarSource] = useState<string>(DEFAULT_AVATAR_PATH);

    useEffect(() => {
        if (loggedInUser) {
            history.push(AppRoutes.HOME);
        }
    }, [loggedInUser, history]);

    const validations: { [key in keyof CreateUser.Request]: any } = {
        first_name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('First name is required'),
        last_name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('Last name is required!'),
        username: Yup.string().min(2, 'Too short!').max(20, 'Too Long!').required('Username is required!'),
        avatar: Yup.mixed().required('Avatar is required'),
        email: Yup.string().email('Must be a valid email').required('Email is required!'),
        password: Yup.string().min(9, 'Must be at least 9 characters').required('Password cannot be empty'),
        tagline: Yup.string().min(2).required('A tagline is required!'),
        date_of_birth: Yup.date().max(moment().subtract(18, 'years').toDate(), 'Must be at least 18').required('Date of birth is required!'),
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

    const handleFormSubmit = async (values: { [key in keyof CreateUser.Request]: any }) => {
        const user = {
            ...values,
            date_of_birth: moment(values.date_of_birth).startOf('day').toISOString(),
        };

        try {
            await createUser(user).unwrap();
            ToastService.success({ title: 'Welcome Aboard!', message: 'Please log in, now!' });
            history.push(AppRoutes.HOME);
        } catch (error) {
            ToastService.error(error);
        }
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

    const handleShowPasswordToggle = () => {
        setIsShowingPassword(!isShowingPassword);
    };

    const handleCancel = () => {
        history.push(AppRoutes.LOGIN);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>{JSON.stringify(error)}</div>;
    }

    return (
        <React.Fragment>
            <Card className="register-form neon-border">
                <Card.Body>
                    <Card.Title>Register</Card.Title>
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
                                            <Form.Text
                                                className={`text-center form-hint ${
                                                    isMouseOverSubmit && errors.avatar ? '' : 'invisible'
                                                }`}>
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
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        placeholder="Email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
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
                                            <ReactDatePicker
                                                closeOnScroll={true}
                                                selected={values.date_of_birth}
                                                onBlur={handleBlur}
                                                onChange={(date) => {
                                                    return Array.isArray(date)
                                                        ? null
                                                        : setFieldValue('date_of_birth', date, true);
                                                }}
                                            />
                                            <Form.Text
                                                className={`form-hint ${isMouseOverSubmit && errors.date_of_birth ? '' : 'invisible'}`}>
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
                                        <Button variant="secondary" type="button" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </span>

                                    <span
                                        onMouseEnter={() => {
                                            setIsMouseOverSubmit(true);
                                        }}
                                        onMouseLeave={() => {
                                            setIsMouseOverSubmit(false);
                                        }}>
                                        <Button variant="dark" type="button" disabled={!isValid} onClick={() => handleSubmit()}>
                                            Register
                                        </Button>
                                    </span>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <hr />

                    <div>
                        <p className="text-muted text-center">Or register with:</p>
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};
