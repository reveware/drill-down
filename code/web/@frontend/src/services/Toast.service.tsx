import { CustomError } from '@drill-down/interfaces';
import React from 'react';
import { toast } from 'react-toastify';

export enum Prompts {
    AfterLogin = 'AfterLogin',
    ErrorHandled = 'ErrorHandled',
    SearchTriggered = 'SearchTriggered',
    InvalidAuth = 'InvalidAuth',
    AfterRegister = 'AfterRegister',
}

const sucessMessage = (title: string, message: string, highlights = []) => {
    return (
        <div>
            <strong>
                {title}
                <span role="img" aria-label="party-pooper">
                    🎉
                </span>
            </strong>
            <p>{message}</p>

            <ul>
                {highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                ))}
            </ul>
        </div>
    );
};

const errorMessage = (e: CustomError) => {
    return (
        <div>
            <div>
                {'An error occurred '}
                <span role="img" aria-label="ashamed">
                    😳
                </span>
            </div>
            <strong>{e.message || e.name}</strong>
            {e.errors && Array.isArray(e.errors) && (
                <ul>
                    {e.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const AfterRegister = () => {
    const content = sucessMessage('Welcome Aboard!', 'Please log in, now!');
    toast.success(content);
};

const AfterLogin = (message: string) => {
    const content = sucessMessage('Welcome back!', message);
    toast.success(content);
};

const ErrorHandled = (e: CustomError) => {
    const error = errorMessage(e);
    toast.error(error);
};

const SearchTriggered = () => {
    const content = sucessMessage('GAHD DAMN', 'This is cool');
    toast.success(content);
};
const InvalidAuth = () => {
    const error = errorMessage({ message: 'Please Log back in', errors: ['Invalid Auth'] } as CustomError);
    toast.error(error);
};
const PromptLibrary = {
    [Prompts.AfterRegister]: AfterRegister,
    [Prompts.AfterLogin]: AfterLogin,
    [Prompts.ErrorHandled]: ErrorHandled,
    [Prompts.SearchTriggered]: SearchTriggered,
    [Prompts.InvalidAuth]: InvalidAuth,
};

export class ToastService {
    static prompt = (prompt: Prompts, args?: any): void => {
        const found = PromptLibrary[prompt];
        found && found(args);
    };
}
