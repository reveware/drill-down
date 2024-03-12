import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { AppRoutes } from '../../Routes';
import 'react-datepicker/dist/react-datepicker.css';
import './Register.scss';
import { useCreateUserMutation } from 'src/hooks';

import { CreateUser } from '@drill-down/interfaces';
import { useAppSelector, selectLoggedInUser } from '../../store/';
import { Loading, RegisterForm, Image } from 'src/components';
import * as images from '../../assets/img';
import { Prompts, ToastService } from 'src/services';

export const Register = () => {
    const navigate = useNavigate();
    const loggedInUser = useAppSelector((state) => selectLoggedInUser(state));
    let [createUser, { isLoading, error }] = useCreateUserMutation();

    useEffect(() => {
        if (loggedInUser) {
            navigate(AppRoutes.HOME);
        }
    }, [loggedInUser, navigate]);

    const handleSubmit = async (user: CreateUser.Request) => {
        try {
            await createUser(user).unwrap();
            ToastService.prompt(Prompts.AfterRegister);
            navigate(AppRoutes.HOME);
        } catch (error) {
            ToastService.prompt(Prompts.ErrorHandled)
        }
    }


    const handleCancel = () => {
        navigate(AppRoutes.LOGIN);
    };

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <div>{JSON.stringify(error)}</div>;
    }


    isLoading = true

    return (
        <div className='register card neon-border'>
            <RegisterForm onSubmit={handleSubmit} onCancel={handleCancel} />
            <Image source={images.Delorean} className="register-poster" alt="time-travel with us" />
        </div>
    );
};
