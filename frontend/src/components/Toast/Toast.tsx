import React, { useEffect } from 'react';
import { toast as toastService } from 'react-toastify';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import './Toast.scss';
import { CustomError } from '../../../../interfaces';

export const Toast: React.FC = () => {
    const { toast } = useSelector((store: StoreState) => store.ui);

    const formatError = (e: CustomError) => {
        console.log(e);
        return (
            <div>
                <p>{e.message}</p>
                <ul>
                    {(e.errors || []).map((e) => (
                        <li>{e}</li>
                    ))}
                </ul>
            </div>
        );
    };

    useEffect(() => {
        if (toast) {
            if (toast.type === 'ERROR') {
                const error = formatError(toast.message as CustomError);
                toastService.error(error);
            } else {
                toastService.success(toast.message);
            }
        }
    }, [toast]);

    return <React.Fragment />;
};
