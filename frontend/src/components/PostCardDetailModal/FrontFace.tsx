import React, { useState } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatUnixTimestamp } from '../../utils';
import { PhotoPost, Populated, Post } from '@drill-down/interfaces';
import './PostCardDetailModal.scss';

interface FrontFaceProps {
    post: Populated<Post>;
    onEdit: () => any;
    onDelete: () => any;
    onPostCardFlip: () => any;
    onHide: () => any;
}

export const FrontFace: React.FC<FrontFaceProps> = (props) => {
    const { post, onPostCardFlip, onHide, onEdit, onDelete } = props;
    const [showCaptions, setShowCaptions] = useState<boolean>(true);

    const { author, description, body, provider, createdAt } = post;
    const { urls: photos } = body as PhotoPost;

    const toggleHideCaptions = () => {
        setShowCaptions(!showCaptions);
    };

    return (
        <div className="front">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="header-actions">
                        <FontAwesomeIcon className="pointer" icon="backward" size="lg" onClick={onPostCardFlip} />
                        <FontAwesomeIcon className="pointer" icon="times" size="lg" onClick={onHide} />
                    </div>
                </div>
                <div className="modal-body">
                    <Carousel controls={photos.length > 1 ? true : false}>
                        {photos.map((photo, i) => (
                            <Carousel.Item key={i}>
                                <Image
                                    src={photo}
                                    fluid
                                    className="d-block front-face-photo"
                                    onMouseDown={toggleHideCaptions}
                                    onMouseUp={toggleHideCaptions}
                                />
                                {showCaptions && (
                                    <Carousel.Caption>
                                        <p>{description}</p>
                                    </Carousel.Caption>
                                )}
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <div className="modal-footer">
                    <div className="footer-origin-info">
                        <span>{author.username}</span>
                        <span>
                            {provider}, {formatUnixTimestamp(createdAt)}
                        </span>
                    </div>
                    <div className="footer-actions">
                        <FontAwesomeIcon className="pointer" icon="edit" size="lg" onClick={onEdit} />
                        <FontAwesomeIcon className="pointer" icon="trash" size="lg" onClick={onDelete} />
                    </div>
                </div>
            </div>
        </div>
    );
};
