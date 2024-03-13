import React from 'react';
import BootstrapButton from 'react-bootstrap/Button';
import './Button.scss';

interface ButtonProps {
    label: string;
    variant: 'primary' | 'secondary' | 'danger' | 'info' | 'link';
    className?: string;
    disabled?: boolean
    onClick: () => void;
}
export const Button: React.FC<ButtonProps> = (props) => {
    const { label, variant, className, onClick, disabled} = props;

    return (
        <BootstrapButton type="button" disabled={disabled} className={`button ${variant} ${className ?? ''}`} onClick={onClick}>
            {label}
        </BootstrapButton>
    );
};

