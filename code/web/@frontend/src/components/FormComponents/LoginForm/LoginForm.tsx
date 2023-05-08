import React, {useState} from 'react';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Form, Button, InputGroup } from 'react-bootstrap';
import * as Yup from 'yup';
import { LoginAttempt } from '@drill-down/interfaces';
import './LoginForm.scss'

interface LoginFormProps {
    onSubmit: (values: LoginAttempt.Request)=> void
}
export const LoginForm: React.FC<LoginFormProps> = (props) => {
    const {onSubmit} = props;
    const [isMouseOverSubmit, setIsMouseOverSubmit] = useState<boolean>(false);
    const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);

    const validations: { [key in keyof LoginAttempt.Request]: any } = {
        email: Yup.string().email('Must be a valid email').required('Email is required!'),
        password: Yup.string().min(9, 'Must be at least 9 characters').required('Password cannot be empty'),
    };

    const loginAttemptSchema = Yup.object().shape(validations);

    const initialValues = {
        email: '',
        password: '',
    };

    
    const handleShowPasswordToggle = () => {
        setIsShowingPassword(!isShowingPassword);
    };

    return (
        <Formik initialValues={initialValues} validationSchema={loginAttemptSchema} onSubmit={onSubmit} validateOnMount={true}>
            {({ isValid, errors, handleChange, handleBlur, handleSubmit }) => (
                <Form>
                    <Form.Group controlId="username">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" type="text" placeholder="Email" onChange={handleChange} onBlur={handleBlur} />
                        <Form.Text className={`form-hint ${isMouseOverSubmit && errors.email ? '' : 'invisible'}`}>
                            {errors.email}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                name="password"
                                type={isShowingPassword ? 'text' : 'password'}
                                placeholder="Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            <InputGroup.Text className='password-toggle'>
                                <FontAwesomeIcon
                                    onClick={handleShowPasswordToggle}
                                    icon={isShowingPassword ? 'eye-slash' : 'eye'}
                                    size="lg"
                                />
                            </InputGroup.Text>
                        </InputGroup>
                        <Form.Text className={`form-hint ${isMouseOverSubmit && errors.password ? '' : 'invisible'}`}>
                            {errors.password}
                        </Form.Text>
                    </Form.Group>

                    <div className="login-button">
                        {/* Disabled buttons don't emit events, so wrap it around span */}
                        <span
                            onMouseEnter={() => {
                                setIsMouseOverSubmit(true);
                            }}
                            onMouseLeave={() => {
                                setIsMouseOverSubmit(false);
                            }}>
                            <Button variant="dark" type="button" disabled={!isValid} onClick={() => handleSubmit()}>
                                Login
                            </Button>
                        </span>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
