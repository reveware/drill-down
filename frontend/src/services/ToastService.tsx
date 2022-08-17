import { CustomError } from '@drill-down/interfaces';
import React from 'react';
import { toast, ToastOptions } from 'react-toastify';

interface SuccessMessage {
    title: string;
    message: string;
    highlights?: string[];
}

export class ToastService {
    private static formatSuccessMessage = (message: SuccessMessage): React.ReactElement => {
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
                    {(message.highlights || []).map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                    ))}
                </ul>
            </div>
        );
    };

    private static formatCustomError = (e: CustomError): React.ReactElement => {
        return (
            <div>
                <strong>Something happened with calling {e.origin} 😳 </strong>
                <p>{e.message || e.name}</p>
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

    public static error(content: CustomError, options?: ToastOptions) {
        toast.error(ToastService.formatCustomError(content), options);
    }

    public static success(content: SuccessMessage, options?: ToastOptions) {
        toast.success(ToastService.formatSuccessMessage(content), options);
    }
}
