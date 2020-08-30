import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import { Key } from 'ts-keycode-enum';
import { AppRoutes } from '../../routes';
import { LogIn } from '../../store/user';
import './Login.scss';
import { isValidEmailAddress } from '../../utils';

export const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);

    const [emailError, setEmailError] = useState<string | null>();
    const [passwordError, setPasswordError] = useState<string | null>();

    const history = useHistory();
    const dispatch = useDispatch();

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

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        dispatch(LogIn(email, password));
    };

    const handleCancel = () => {
        history.push(AppRoutes.HOME);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === Key.Enter && !isFormDisabled) {
            handleSubmit();
        }
    };

    return (
        <React.Fragment>
            <Card className="mx-auto w-50">
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
                            <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} />
                            <Form.Text className={`form-hint ${isMouseOverSubmit && passwordError ? '' : 'invisible'}`}>
                                {passwordError}
                            </Form.Text>
                        </Form.Group>

                        <div className="login-form-buttons">
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
                                <Button variant="primary" className="mr-5" type="button" disabled={isFormDisabled} onClick={handleSubmit}>
                                    Login
                                </Button>
                            </span>
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
