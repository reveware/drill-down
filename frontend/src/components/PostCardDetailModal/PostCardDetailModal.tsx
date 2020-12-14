import { PhotoPost, Post } from '@drill-down/interfaces';
import React, { useLayoutEffect, useState } from 'react';
import './PostCardDetailModal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store';
import { setPostForDetailsModal } from '../../store/actions';
import $ from 'jquery';
import 'bootstrap';
import { Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatUnixTimestamp } from '../../utils';

export const PostCardDetailModal: React.FC = () => {
    const { postForDetailsModal } = useSelector((state: AppState) => state.ui);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const dispatch = useDispatch();

    // Since we're opening the modal manually, we need to do it before the render
    useLayoutEffect(() => {
        const modal = $('#post-card-detail-modal') as any;

        modal.on('hidden.bs.modal', function () {
            dispatch(setPostForDetailsModal(null));
        });

        if (!postForDetailsModal) {
            setIsFlipped(false);
            modal.modal('hide');
            // Get rid of the backdrop
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            return;
        }

        modal.modal('show');

        if (isFlipped) {
            $('.flipper').addClass('flip');
        } else {
            $('.flipper').removeClass('flip');
        }
    }, [isFlipped, postForDetailsModal]);

    const handleHide = () => {
        dispatch(setPostForDetailsModal(null));
    };

    const handleEdit = () => {
        // TODO:
    };

    const handleDelete = () => {
        // TODO:
    };

    const togglePostCardFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (!postForDetailsModal) {
        return null;
    }
    

    const { author, createdAt, body, description, tags, provider } = postForDetailsModal;

    const { urls: photos } = body as PhotoPost;

    const FrontFace: React.FC = () => {
        const [showCaptions, setShowCaptions] = useState<boolean>(true);

        const toggleHideCaptions = () => {
            setShowCaptions(!showCaptions);
        };

        return (
            <div className="front">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="header-actions">
                            <FontAwesomeIcon className="pointer" icon="backward" size="lg" onClick={togglePostCardFlip} />
                            <FontAwesomeIcon className="pointer" icon="times" size="lg" onClick={handleHide} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <Carousel controls={photos.length > 1 ? true : false}>
                            {photos.map((photo, i) => (
                                <Carousel.Item key={i}>
                                    <Image
                                        src={photo}
                                        fluid
                                        className="d-block w-100"
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
                            <span>{typeof author === 'string' ? author : author.username}</span>
                            <span>
                                {provider}, {formatUnixTimestamp(createdAt)}
                            </span>
                        </div>
                        <div className="footer-actions">
                            <FontAwesomeIcon className="pointer" icon="edit" size="lg" onClick={handleEdit} />
                            <FontAwesomeIcon className="pointer" icon="trash" size="lg" onClick={handleDelete} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const BackFace: React.FC = () => {
        return (
            <div className="back">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="header-icons">
                            <FontAwesomeIcon className="pointer" icon="forward" size="lg" onClick={togglePostCardFlip} />
                        </div>
                    </div>
                    <div className="modal-body">
                        my sample text on backside
                        <div className="right">
                            <button onClick={togglePostCardFlip}>back</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div
                className="modal"
                id="post-card-detail-modal"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="Post detail modal"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="flipper">
                        <FrontFace />
                        <BackFace />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
