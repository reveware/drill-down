import React from 'react';
import './Avatar.scss';

interface AvatarProps {
    source: string;
    type?: 'circle' | 'square';
    border?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ source, type = 'circle', border = true }) => {
    return (
        <div className='avatar'>
            <img src={source} alt={`avatar-${type}`} className={`avatar-photo ${type} ${border ? 'bordered' : ''}`} />
        </div>
    );
};
