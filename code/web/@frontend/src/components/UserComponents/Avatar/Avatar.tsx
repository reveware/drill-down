import React from 'react';
import './Avatar.scss';
import { Image } from 'src/components';

interface AvatarProps {
    source: string;
    type?: 'circle' | 'square';
    border?: boolean;
    className?: string
}

export const Avatar: React.FC<AvatarProps> = (props) => {
    const{ source } = props;
    const type = props.type || 'circle'
    const border = props.border || false;
    const className = props.className || 'avatar';
    return (
        <div className={className}>
            <Image source={source} className={`avatar-photo ${type} ${border ? 'bordered' : ''}`}  alt={`avatar-${type}`}/>
        </div>
    );
};
