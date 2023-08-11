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
    const [createUser, { isLoading, error }] = useCreateUserMutation();

    useEffect(() => {
        if (loggedInUser) {
            navigate(AppRoutes.HOME);
        }
    }, [loggedInUser, navigate]);

    const handleSubmit = async(user: CreateUser.Request)=> {
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
        return <Loading />;
    }

    if (error) {
        return <div>{JSON.stringify(error)}</div>;
    }

    return (
        <div className="register">
            <Card className="neon-border register-card">
                <Card.Body>
                    <Card.Title>Register</Card.Title>

                    <RegisterForm onSubmit={handleSubmit} onCancel={handleCancel} />            

                    <hr />
                    <div>
                        <p className="text-muted text-center">Or register with:</p>
                    </div>
                </Card.Body>
            </Card>

            <Image source={images.Delorean} className="register-image" alt="time-travel with us" />
        </div>
    );
};
