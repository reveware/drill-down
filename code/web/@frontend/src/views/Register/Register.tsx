import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { AppRoutes } from '../../Routes';

import 'react-datepicker/dist/react-datepicker.css';
import './Register.scss';
import { useCreateUserMutation } from 'src/hooks';

import { CreateUser } from '@drill-down/interfaces';
import { useAppSelector, selectLoggedInUser } from '../../store/';
import {  Loading, RegisterForm } from 'src/components';
import { Prompts, ToastService } from 'src/services';

export const Register = () => {
    const history = useHistory();
    const loggedInUser = useAppSelector((state) => selectLoggedInUser(state));
    const [createUser, { isLoading, error }] = useCreateUserMutation();

    useEffect(() => {
        if (loggedInUser) {
            history.push(AppRoutes.HOME);
        }
    }, [loggedInUser, history]);

    const handleSubmit = async(user: CreateUser.Request)=> {
        try {
            await createUser(user).unwrap();
            ToastService.prompt(Prompts.AfterRegister);
            history.push(AppRoutes.HOME);
        } catch (error) {
            ToastService.prompt(Prompts.ErrorHandled)
        }
    }


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
        <div className='register'>
            <Card className="register-form neon-border">
                <Card.Body>
                    <Card.Title>Register</Card.Title>

                    <RegisterForm onSubmit={handleSubmit} onCancel={handleCancel} />            

                    <hr />

                    <div>
                        <p className="text-muted text-center">Or register with:</p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};
