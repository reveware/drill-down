import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { AppRoutes } from '../../Routes';
import { LoginAttempt } from '@drill-down/interfaces';
import { selectLoggedInUser, useAppSelector, useAppDispatch, logIn } from '../../store';
import * as images from '../../assets/img';
import './Login.scss';
import { useLoginAttemptMutation } from 'src/hooks';
import { Prompts, ToastService } from 'src/services';
import { Loading, LoginForm, Image } from 'src/components';

export const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loggedInUser = useAppSelector(selectLoggedInUser);

    // TODO: handle  error
    let [loginAttempt, { isLoading }] = useLoginAttemptMutation();

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


    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="login card neon-border">
            <Image source={images.AstroWelcome} className='login-image' alt="welcome-back-astro" />
            <hr />
            <LoginForm onSubmit={handleSubmit} />
        </div>

    );
};
