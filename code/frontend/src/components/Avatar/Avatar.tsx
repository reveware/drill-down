import React, {useEffect} from 'react';
import './Avatar.scss';

interface AvatarProps {
    id?: string;
    source: string;
    style?: 'circle' | 'square';
    border?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ id, source, style = 'circle', border = true }) => {
    return (
        <div id={id || 'avatar'} className='avatar'>
            <img src={source} className={`avatar-photo ${style} ${border ? 'bordered' : ''}`} />
        </div>
    );
};
