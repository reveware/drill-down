import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';

interface TextBoxProps {
    text: string;
    maxLength: number;
    className?: string;
}
export const TextBox: React.FC<TextBoxProps> = (props) => {
    const { text, maxLength, className } = props;

    const shouldCollapse = text.length > maxLength;

    const trimmedMessage = text.substr(0, maxLength);
    const remainingMessage = text.substr(maxLength, text.length);

    const [isShowingTrimmedMessage, setIsShowingTrimmedMessage] = useState<boolean>(false);

    return (
        <div className={className}>
            <span>{trimmedMessage}</span>
            <Collapse in={isShowingTrimmedMessage}>
                <span>{remainingMessage}</span>
            </Collapse>
            <span
                className={shouldCollapse ? 'link' : 'hidden'}
                onClick={() => {
                    setIsShowingTrimmedMessage(!isShowingTrimmedMessage);
                }}>
                {isShowingTrimmedMessage ? ' ...less' : ' ...more'}
            </span>
        </div>
    );
};
