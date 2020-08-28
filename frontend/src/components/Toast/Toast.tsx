import React, { useEffect } from 'react';
import { toast as toastService } from 'react-toastify';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import './Toast.scss';
import { CustomError } from '../../../../interfaces';
import { ToastTypes, SuccessMessage } from '../../store/ui';

export const Toast: React.FC = () => {
    const { toast } = useSelector((store: StoreState) => store.ui);

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
        console.log(e);
        return (
            <div>
                <p>{e.message || e.name}</p>
                {e.errors && e.errors.length > 0 ? (
                    <ul>
                        {e.errors.map((e) => (
                            <li>{e}</li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        A very mysterious error, indeed.{' '}
                        <span role="img" aria-label="tired-face">
                            😩
                        </span>
                    </p>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (toast) {
            console.log(toast);
            if (toast.type === ToastTypes.ERROR) {
                toastService.error(formatError(toast.content as CustomError));
                return;
            }

            if (toast.type === ToastTypes.SUCCESS) {
                toastService.success(formatSuccessMessage(toast.content as SuccessMessage));
                return;
            }
        }
    }, [toast]);

    return <React.Fragment />;
};
