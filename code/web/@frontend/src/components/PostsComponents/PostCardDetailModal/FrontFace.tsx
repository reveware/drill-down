import React, { useState } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PostCardDetailModal.scss';
import { history } from '../../../App';
import { AppRoutes } from '../../../Routes';
import moment from 'moment';
import { PhotoPostContent, PostOverview, PostTypes, QuotePostContent } from '@drill-down/interfaces';
import { Values } from '@drill-down/constants';
import { TextBox } from 'src/components/TextBox/TextBox';

interface FrontFaceProps {
    post: PostOverview;
    onEdit: () => any;
    onDelete: () => any;
    onPostCardFlip: () => any;
    onHide: () => any;
}

export const FrontFace: React.FC<FrontFaceProps> = (props) => {
    const { post, onPostCardFlip, onHide, onEdit, onDelete } = props;
    const [showCaptions, setShowCaptions] = useState<boolean>(true);

    const toggleHideCaptions = () => {
        setShowCaptions(!showCaptions);
    };

    const { author, content, description, created_at } = post;

    const renderPhotoContent = (content: PhotoPostContent) => {
        const hasMultiplePhotos = content.urls.length > 1;
        return (
            <Carousel className="image-carousel" indicators={false} controls={hasMultiplePhotos} nextLabel="" prevLabel="">
                {content.urls.map((photo, i) => (
                    <Carousel.Item key={i} className="image-carousel-item">
                        <Image src={photo} fluid onMouseDown={toggleHideCaptions} onMouseUp={toggleHideCaptions} />
                    </Carousel.Item>
                ))}
                {showCaptions && description && <p className="captions">{description}</p>}
            </Carousel>
        );
    };

    const renderQuoteContent = (content: QuotePostContent) => {
        return (
            <div className="quote-content">
                <p className="quote-content-quote">{content.quote}</p>
                <span className="quote-content-author"> {content.author}</span>
            </div>
        );
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
                            {post.type === PostTypes.PHOTO && renderPhotoContent(content as PhotoPostContent)}
                            {post.type === PostTypes.QUOTE && renderQuoteContent(content as QuotePostContent)}
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
                        <span>{moment(created_at).format(Values.DATE_TIME_FORMAT)}</span>
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
