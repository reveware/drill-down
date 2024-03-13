import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './HintMessage.scss';

interface HintMessage {
    message: string;
    icon?: number;
}

export const HintMessage: React.FC<HintMessage> = (props) => {
    const { message, icon } = props;
    const Icon = icon || <FontAwesomeIcon icon={'exclamation-triangle'} size="sm" />;
    return (
        <div className="hint-message">
            {Icon}
            <span>
                 {message}
            </span>
        </div>
    );
};
