import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { AppRoutes } from '../../Routes';
import { LoginAttempt } from '@drill-down/interfaces';
import { selectLoggedInUser, useAppSelector, useAppDispatch, logIn } from '../../store';

import './Login.scss';
import { useLoginAttemptMutation } from 'src/hooks';
import { Prompts, ToastService } from 'src/services';
import { Loading, LoginForm } from 'src/components';

export const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loggedInUser = useAppSelector(selectLoggedInUser);

    // TODO: handle  error
    const [loginAttempt, { isLoading }] = useLoginAttemptMutation();

    useEffect(() => {
        if (loggedInUser) {
            navigate(AppRoutes.HOME);
        }
    }, [loggedInUser, navigate]);

    const handleSubmit = async (values: { [key in keyof LoginAttempt.Request]: any }) => {
        try {
            const authResponse = await loginAttempt(values).unwrap();
            dispatch(logIn(authResponse));
            ToastService.prompt(Prompts.AfterLogin, authResponse.message);
        } catch (error) {
            ToastService.prompt(Prompts.ErrorHandled, error);
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
