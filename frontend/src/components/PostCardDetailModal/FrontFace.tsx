import React, { useState } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatUnixTimestamp } from '../../utils';
import { PhotoPost } from '@drill-down/interfaces';
import './PostCardDetailModal.scss';
import { history } from '../../App';
import { AppRoutes } from '../../Routes';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/store.type';
import { selectPostById } from '../../store';

interface FrontFaceProps {
    postId: string;
    onEdit: () => any;
    onDelete: () => any;
    onPostCardFlip: () => any;
    onHide: () => any;
}

export const FrontFace: React.FC<FrontFaceProps> = (props) => {
    const { postId, onPostCardFlip, onHide, onEdit, onDelete } = props;
    const [showCaptions, setShowCaptions] = useState<boolean>(true);
    const post = useSelector((state: AppState) => selectPostById(state, postId));

    if (!post) {
        return null;
    }

    const { author, description, body, provider, createdAt } = post;
    const { urls: photos } = body as PhotoPost;

    const toggleHideCaptions = () => {
        setShowCaptions(!showCaptions);
    };

    const hasMultiplePhotos = photos.length > 1
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
                            <Carousel className="image-carousel" indicators={hasMultiplePhotos} controls={hasMultiplePhotos}>
                                {photos.map((photo, i) => (
                                    <div key={i} className="image-carousel-item">
                                        <Image src={photo} fluid onMouseDown={toggleHideCaptions} onMouseUp={toggleHideCaptions} />
                                        {showCaptions && description && <p className="captions">{description}</p>}
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="footer-origin-info">
                        <span
                            className="pointer"
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
