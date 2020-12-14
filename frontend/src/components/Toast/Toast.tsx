import React, { useEffect } from 'react';
import { toast as toastService, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { CustomError } from '@drill-down/interfaces';
import { SuccessMessage, ToastTypes } from '../../types';
import { AppState } from '../../store';
import { setToast } from '../../store/actions';
import './Toast.scss';


export const Toast: React.FC = () => {
    const dispatch = useDispatch();
    const { toast } = useSelector((state: AppState) => state.ui);

    const onToastClosed = () => {
        dispatch(setToast(null));
    };

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
                toastService.error(formatError(toast.content as CustomError), { onClose: onToastClosed });
                return;
            }

            if (toast.type === ToastTypes.SUCCESS) {
                toastService.success(formatSuccessMessage(toast.content as SuccessMessage), { onClose: onToastClosed });
                return;
            }

            if (toast.type === ToastTypes.CUSTOM) {
                const component = toast.content;
                toastService.info(component, { onClose: onToastClosed });
            }
        }
    }, [toast]);

    return <ToastContainer className="toast-container" />;
};
