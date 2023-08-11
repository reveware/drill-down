import React from 'react';
import Img from 'react-bootstrap/Image';
import './Image.scss';

export interface ImageProps {
    id?: string;
    source: string;
    className?: string;
    alt?: string;
}

export const Image: React.FC<ImageProps> = (props) => {
    const { id, source, className, alt } = props;
    return <Img id={id} className={`image ${className ?? ''}`} src={source} alt={alt} />;
};

