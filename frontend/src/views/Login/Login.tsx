import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Key } from 'ts-keycode-enum';
import { AppRoutes } from '../../Routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isValidEmailAddress } from '../../utils';
import { logIn, selectLoggedInUser } from '../../store';

import './Login.scss';

export const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(selectLoggedInUser);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>();
    const [passwordError, setPasswordError] = useState<string | null>();

    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);
    const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            history.push(AppRoutes.HOME);
        }
    }, [user]);

    useEffect(() => {
        if (email === '') {
            return setEmailError('Email cannot be empty');
        }
        if (!isValidEmailAddress(email)) {
            return setEmailError('Should be a valid e-mail address');
        }

        setEmailError(null);
    }, [email]);

    useEffect(() => {
        if (password === '') {
            return setPasswordError('Password cannot be empty');
        }
        if (password.length < 9) {
            return setPasswordError('Should be at least 9 characters');
        }

        setPasswordError(null);
    }, [password]);

    const isFormDisabled = !!(emailError || passwordError);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleShowPasswordToggle = () => {
        setIsShowingPassword(!isShowingPassword);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        dispatch(logIn({ email, password }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === Key.Enter && !isFormDisabled) {
            handleSubmit();
        }
    };

    return (
        <React.Fragment>
            <Card className="mx-auto mt-5 mb-5 w-50 neon-border">
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Form onKeyDown={handleKeyDown}>
                        <Form.Group controlId="username">
                            <Form.Label>User</Form.Label>
                            <Form.Control type="text" placeholder="Email" onChange={handleEmailChange} />
                            <Form.Text className={`form-hint ${isMouseOverSubmit && emailError ? '' : 'invisible'}`}>
                                {emailError}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={isShowingPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    onChange={handlePasswordChange}
                                />
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon
                                            onClick={handleShowPasswordToggle}
                                            icon={isShowingPassword ? 'eye-slash' : 'eye'}
                                            size="lg"
                                        />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                            <Form.Text className={`form-hint ${isMouseOverSubmit && passwordError ? '' : 'invisible'}`}>
                                {passwordError}
                            </Form.Text>
                        </Form.Group>

                        {/* Disabled buttons don't emit events, so wrap it around span */}
                        <div
                            onMouseEnter={() => {
                                setIsMouseOverSubmit(true);
                            }}
                            onMouseLeave={() => {
                                setIsMouseOverSubmit(false);
                            }}>
                            <Button block variant="dark" type="button" disabled={isFormDisabled} onClick={handleSubmit}>
                                Login
                            </Button>
                        </div>
                    </Form>

                    <hr />
                    <p className="text-muted text-center">
                        Not a member? <a href={AppRoutes.REGISTER}>Register</a>
                    </p>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};
