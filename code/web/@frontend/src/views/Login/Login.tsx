import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { AppRoutes } from '../../Routes';
import { LoginAttempt } from '@drill-down/interfaces';
import { selectLoggedInUser, useAppSelector, useAppDispatch, logIn } from '../../store';

import './Login.scss';
import { useLoginAttemptMutation } from 'src/hooks';
import { ToastService } from 'src/services';
import { Loading, LoginForm } from 'src/components';

export const Login = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const loggedInUser = useAppSelector(selectLoggedInUser);

    // TODO: handle  error
    const [loginAttempt, { isLoading }] = useLoginAttemptMutation();

    useEffect(() => {
        if (loggedInUser) {
            history.push(AppRoutes.HOME);
        }
    }, [loggedInUser, history]);

    const handleSubmit = async (values: { [key in keyof LoginAttempt.Request]: any }) => {
        try {
            const authResponse = await loginAttempt(values).unwrap();
            dispatch(logIn(authResponse));
            ToastService.success({ title: `Welcome back!`, message: authResponse.message });
        } catch (error) {
            ToastService.error(error);
        }
    };

    return (
        <div className="login">
            <Card className="login-form neon-border">
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    {isLoading && <Loading />}
                    {!isLoading && <LoginForm onSubmit={handleSubmit} />}
                    <hr />
                    <p className="text-muted text-center">
                        Not a member? <a href={AppRoutes.REGISTER}>Register</a>
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
};
