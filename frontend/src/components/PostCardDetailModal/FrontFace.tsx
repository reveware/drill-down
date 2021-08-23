import React, { useState } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatUnixTimestamp } from '../../utils';
import { PhotoPost, Populated, Post } from '@drill-down/interfaces';
import './PostCardDetailModal.scss';
import { history } from '../../App';
import { AppRoutes } from '../../Routes';

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
                        <FontAwesomeIcon className="pointer" icon="backward" size="sm" onClick={onPostCardFlip} />
                        <FontAwesomeIcon className="pointer" icon="times" size="sm" onClick={onHide} />
                    </div>
                </div>
                <div className="modal-body">
                    <div className="front-face">
                    <div className="post-content">
                    <Carousel className="image-carousel" indicators={photos.length > 1} controls={photos.length > 1}>
                        {photos.map((photo, i) => (
        <div className="image-carousel-item">
        <Image
            src={photo}
            fluid
            onMouseDown={toggleHideCaptions}
            onMouseUp={toggleHideCaptions}
        />
        {showCaptions && description && (
              <p className="captions">{description}</p>
        )}
        </div>
                        ))}
                    </Carousel>
                    </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="footer-origin-info">
                        <span className="pointer"
                            onClick={() => {
                                history.push(AppRoutes.USER_PROFILE.replace(':username', author.username));
                            }}>
                            {author.username}
                        </span>
                        <span>
                            {provider}, {formatUnixTimestamp(createdAt)}
                        </span>
                    </div>
                    <div className="footer-actions">
                        <FontAwesomeIcon className="pointer mr-1" icon="edit" size="sm" onClick={onEdit} />
                        <FontAwesomeIcon className="pointer" icon="trash" size="sm" onClick={onDelete} />
                    </div>
                </div>
            </div>
        </div>
    );
};
