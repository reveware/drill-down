import React, { useState, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Image, InputGroup } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import * as _ from 'lodash';
import { Key } from 'ts-keycode-enum';
import { AppRoutes } from '../../routes';
import { isValidImageType } from '../../utils';
import 'react-datepicker/dist/react-datepicker.css';
import './Register.scss';
import { createUser } from '../../store/actions';
import { initialRegisterFormState, registerReducer } from './register.reducer';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppService } from '../../services';
import { AppState } from '../../store';

export const Register = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { token } = useSelector((state: AppState) => state.auth);

    const appService = new AppService();
    const isAuthenticated = appService.isAuthValid(token);

    if (isAuthenticated) {
        history.push(AppRoutes.HOME);
    }

    const [state, updateState] = useReducer(registerReducer, initialRegisterFormState);
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);
    const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);


    const handleAvatarPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;

        if (fileList && fileList.length > 0) {
            const file = fileList[0];

            updateState({ type: 'avatar', payload: file });

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    const avatarPhoto = document.getElementById('avatar-photo') as HTMLImageElement;
                    avatarPhoto.src = reader.result.toString();
                }
            };
        }
    };

    const handleShowPasswordToggle = () => {
        setIsShowingPassword(!isShowingPassword);
    };

    const handleSubmit = () => {
        const user = state.user;

        // Avatar file uploads only seem to work with form data
        const formData = new FormData();

        const keys = Object.keys(user);

        for (const key of keys) {
            if (key === 'avatar') {
                // We'll add at the end because multer can't read it.
                // https://stackoverflow.com/questions/39589022/node-js-multer-and-req-body-empty
                continue;
            }

            if (key === 'dateOfBirth') {
                formData.append(
                    key,
                    moment((user as any)[key])
                        .startOf('day')
                        .toISOString()
                );
            } else {
                formData.append(key, (user as any)[key]);
            }
        }
        formData.append('avatar', user.avatar);

        dispatch(createUser(formData));
    };

    const handleCancel = () => {
        history.push(AppRoutes.HOME);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === Key.Enter && !isFormDisabled) {
            handleSubmit();
        }
    };

    const isSomeFieldEmpty = _.some(state.user, (value, field) => {
        if (field === 'avatar') {
            return !(value && value.type && isValidImageType(value.type));
        }

        return !value;
    });

    const isSomeFieldWithErrors = _.some(state.errors, (error) => !_.isNull(error));
    const isFormDisabled = isSomeFieldEmpty || isSomeFieldWithErrors;

    return (
        <React.Fragment>
            <Card className="mx-auto w-50 mt-5 mb-5 neon-border">
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
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateState({ type: 'username', payload: e.target.value });
                                        }}
                                    />
                                    <Form.Text className={`form-hint ${isMouseOverSubmit && state.errors.username ? '' : 'invisible'}`}>
                                        {state.errors.username}
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
                            <InputGroup>
                                <Form.Control
                                    type={isShowingPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        updateState({ type: 'password', payload: e.target.value });
                                    }}
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon
                                            onClick={handleShowPasswordToggle}
                                            icon={isShowingPassword ? 'eye-slash' : 'eye'}
                                            size="lg"
                                        />
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
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
                                <Button className="mr-5" variant="secondary" type="button" onClick={handleCancel}>
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
