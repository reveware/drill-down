import React, { useEffect } from 'react';
import { toast as toastService } from 'react-toastify';
import { useSelector } from 'react-redux';

import './Toast.scss';
import { CustomError } from '../../../../interfaces';
import {SuccessMessage, ToastTypes} from "../../store/types";
import {AppState} from "../../store";


export const Toast: React.FC = () => {
    const { toast } = useSelector((state: AppState) => state.ui);

    const formatSuccessMessage = (message: SuccessMessage) => {
        return (
            <div>
                <strong>
                    {message.title}{' '}
                    <span role="img" aria-label="party-pooper">
                        🎉
                    </span>
                </strong>
                <p>{message.message}</p>

                <ul>
                    {(message.highlights || []).map((highlight) => (
                        <li>{highlight}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const formatError = (e: CustomError) => {
        console.log('formatError', e);
        return (
            <div>
                <p>{e.message || e.name}</p>
                {e.errors && Array.isArray(e.errors) && (
                    <ul>
                        {e.errors.map((e) => (
                            <li>{e}</li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (toast) {
            if (toast.type === ToastTypes.ERROR) {
                toastService.error(formatError(toast.content as CustomError));
                return;
            }

            if (toast.type === ToastTypes.SUCCESS) {
                toastService.success(formatSuccessMessage(toast.content as SuccessMessage));
                return;
            }

            if(toast.type === ToastTypes.CUSTOM) {
                const component = toast.content;
                toastService.info(component);
            }
        }
    }, [toast]);

    return <React.Fragment />;
};
