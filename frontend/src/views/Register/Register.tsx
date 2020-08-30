import React, { useState, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Image } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import * as _ from 'lodash';
import { Key } from 'ts-keycode-enum';
import { AppRoutes } from '../../routes';
import { CreateUser } from '../../store/user';
import { isValidEmailAddress } from '../../utils';
import 'react-datepicker/dist/react-datepicker.css';
import './Register.scss';
import { CreateUserDTO } from '../../types/dtos.types';

type RegisterFormState = {
    user: CreateUserDTO;
    errors: {
        avatar: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        password: string | null;
        tagLine: string | null;
        dateOfBirth: string | null;
    };
};

export const Register = () => {
    const initialState: RegisterFormState = {
        user: {
            avatar: null,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            tagLine: '',
            dateOfBirth: new Date(),
            role: 'USER',
        },
        errors: {
            avatar: 'An avatar photo is required',
            firstName: 'First name cannot be empty',
            lastName: 'Last name cannot be empty',
            email: 'Email cannot be empty',
            password: 'Password cannot be empty',
            tagLine: 'Tag line cannot be empty',
            dateOfBirth: 'You must select your date of birth',
        },
    };

    const reducer = (state: RegisterFormState, action: { type: string; payload: any }) => {
        switch (action.type) {
            case 'avatar':
                const file = action.payload;
                return { user: { ...state.user, avatar: file }, errors: { ...state.errors, avatar: null } };

            case 'firstName':
                const firstName = action.payload;
                if (firstName === '') {
                    return { ...state, errors: { ...state.errors, firstName: 'First name cannot be empty' } };
                }
                return { user: { ...state.user, firstName }, errors: { ...state.errors, firstName: null } };

            case 'lastName':
                const lastName = action.payload;
                if (lastName === '') {
                    return { ...state, errors: { ...state.errors, lastName: 'Last name cannot be empty' } };
                }
                return { user: { ...state.user, lastName }, errors: { ...state.errors, lastName: null } };

            case 'email':
                const email = action.payload;
                if (email === '') {
                    return { ...state, errors: { ...state.errors, email: 'Email cannot be empty' } };
                }
                if (!isValidEmailAddress(email)) {
                    return { ...state, errors: { ...state.errors, email: 'Should be a valid e-mail address' } };
                }

                return { user: { ...state.user, email }, errors: { ...state.errors, email: null } };
            case 'password':
                const password = action.payload;
                if (password === '') {
                    return { ...state, errors: { ...state.errors, password: 'Password cannot be empty' } };
                }
                if (password.length < 9) {
                    return { ...state, errors: { ...state.errors, password: 'Should be at least 9 characters' } };
                }

                return { user: { ...state.user, password }, errors: { ...state.errors, password: null } };

            case 'dateOfBirth':
                const dateOfBirth = action.payload;
                if (!dateOfBirth) {
                    return { ...state, errors: { ...state.errors, lastName: 'Date of birth is required' } };
                }
                // TODO: Should date be validated in < years > ?
                return { user: { ...state.user, dateOfBirth }, errors: { ...state.errors, dateOfBirth: null } };

            case 'tagLine':
                const tagline = action.payload;
                if (tagline === '') {
                    return { ...state, errors: { ...state.errors, lastName: 'Tag line cannot be empty' } };
                }
                return { user: { ...state.user, tagline }, errors: { ...state.errors, tagLine: null } };

            default:
                return state;
        }
    };

    const [state, updateState] = useReducer(reducer, initialState);
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);

    const history = useHistory();
    const dispatch = useDispatch();

    const handleAvatarPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        const fileList = e.target.files;

        if (fileList && fileList.length > 0) {
            const avatarPhoto = document.getElementById('avatar-photo') as HTMLImageElement;
            const file = fileList[0];
            updateState({ type: 'avatar', payload: file });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    avatarPhoto.src = reader.result.toString();
                }
            };
        }
    };

    const handleSubmit = () => {
        const user = state.user;
        dispatch(CreateUser(user));
    };

    const handleCancel = () => {
        history.push(AppRoutes.HOME);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === Key.Enter) {
            handleSubmit();
        }
    };

    const isFormDisabled = _.some(state.errors, (error) => !_.isNull(error)) || _.some(state.user, (value) => _.isEmpty(value));

    return (
        <React.Fragment>
            <Card className="mx-auto w-50 neon-border">
                <Card.Body>
                    <Card.Title>Register</Card.Title>
                    <Form onKeyDown={handleKeyDown}>
                        <Row>
                            <Col>
                                <div className="avatar">
                                    <label htmlFor="avatar-file">
                                        <Image id="avatar-photo" className="avatar-photo" src="/images/default-avatar.png" roundedCircle />
                                    </label>

                                    <Form.File
                                        accept="image/*"
                                        id="avatar-file"
                                        className="avatar-file"
                                        label="Avatar"
                                        custom
                                        onChange={handleAvatarPhotoChange}
                                    />
                                    <Form.Text
                                        className={`text-center form-hint ${isMouseOverSubmit && state.errors.avatar ? '' : 'invisible'}`}>
                                        {state.errors.avatar}
                                    </Form.Text>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="first-name">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateState({ type: 'firstName', payload: e.target.value });
                                        }}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && state.errors.firstName ? '' : 'invisible'}`}>
                                        {state.errors.firstName}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="last-name">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateState({ type: 'lastName', payload: e.target.value });
                                        }}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && state.errors.lastName ? '' : 'invisible'}`}>
                                        {state.errors.lastName}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    updateState({ type: 'email', payload: e.target.value });
                                }}
                            />
                            <Form.Text className={`form-hint ${isMouseOverSubmit && state.errors.email ? '' : 'invisible'}`}>
                                {state.errors.email}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    updateState({ type: 'password', payload: e.target.value });
                                }}
                            />
                            <Form.Text className={`form-hint ${isMouseOverSubmit && state.errors.password ? '' : 'invisible'}`}>
                                {state.errors.password}
                            </Form.Text>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group controlId="dateOfBirth">
                                    <Form.Label>Date Of Birth</Form.Label>
                                    <ReactDatePicker
                                        closeOnScroll={true}
                                        selected={state.user.dateOfBirth}
                                        onChange={(date) => {
                                            updateState({ type: 'dateOfBirth', payload: date });
                                        }}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && state.errors.dateOfBirth ? '' : 'invisible'}`}>
                                        {state.errors.dateOfBirth}
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="tagline">
                                    <Form.Label>Tag Line</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Slow down"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateState({ type: 'tagLine', payload: e.target.value });
                                        }}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && state.errors.tagLine ? '' : 'invisible'}`}>
                                        {state.errors.tagLine}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="register-form-buttons">
                            {/* Disabled buttons don't emit events, so wrap it around span */}
                            <span>
                                <Button  className="mr-5" variant="secondary" type="button" onClick={handleCancel}>
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
                                <Button variant="primary" type="button" disabled={isFormDisabled} onClick={handleSubmit}>
                                    Register
                                </Button>
                            </span>
                        </div>
                    </Form>

                    <hr />

                    <div>
                        <p className="text-muted text-center">Or register with:</p>
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};
