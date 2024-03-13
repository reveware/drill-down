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
    const { id, source, alt } = props;
    const className= props.className || 'image'
    
    return <Img id={id} className={className} src={source} alt={alt} />;
};

