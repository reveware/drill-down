import React from 'react';
import './Avatar.scss';
import { Image } from 'src/components';

interface AvatarProps {
    source: string;
    type?: 'circle' | 'square';
    border?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ source, type = 'circle', border = true }) => {
    return (
        <div className='avatar'>
            <Image source={source} alt={`avatar-${type}`} className={`avatar-photo ${type} ${border ? 'bordered' : ''}`}/>
        </div>
    );
};
