import React from 'react';
import { UserDetail } from '@drill-down/interfaces';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, TextBox } from '../../../components';
import { selectLoggedInUser } from '../../../store';
import './UserOverviewCard.scss';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from 'src/Routes';


interface UserOverviewCardProps {
    user: UserDetail;
    className?: string;
}
export const UserOverviewCard: React.FC<UserOverviewCardProps> = (props) => {
    const currentUser = useSelector(selectLoggedInUser);
    const { user, className } = props;
     
    const navigate = useNavigate();
    const isMySelf = user.id === currentUser?.id;

    const handleChatClick = () => {
        navigate(AppRoutes.CHAT);
    };

    const handleFriendRequest = ()=> {
        alert('add as friend');
    }

    const handleSendTimeBomb = ()=> {
        alert('show timebomb creation modal')
    }

    return (
        <Card className={`user-overview-card ${className || ''}`}>
            <div className="overview-avatar">
                <Avatar type="circle" source={user.avatar} border />
            </div>

            <div className="user-profile-details">
                <div>
                    <h1 className='title'>{`${user.first_name} ${user.last_name}`}</h1>

                    <h2 className='subtitle'>{`@${user.username}`}</h2>

                    {user.tagline && (
                        <div>
                            <TextBox className="text-muted" text={user.tagline} maxLength={100} />
                        </div>
                    )}
                </div>
                <div className="user-profile-stats">
                    <span> {user.friends.length} Friends</span>
                    <span> {user.likes.length} Likes </span>
                </div>

                <hr />

                <div className="user-profile-actions">
                    {!isMySelf && (
                        <div className="pointer profile-action" onClick={handleFriendRequest}>
                            <FontAwesomeIcon className="action-icon" size="lg" icon="user-friends" />
                            <span className="icon-label">Befriend</span>
                        </div>
                    )}

                    <div className="pointer profile-action" onClick={handleChatClick}>
                        <FontAwesomeIcon className="action-icon" size="lg" icon="comment-alt" />
                        <span className="icon-label">
                            Message
                        </span>
                    </div>
                    <div className="pointer profile-action" onClick={handleSendTimeBomb}>
                        <FontAwesomeIcon className="action-icon" size="lg" icon="bomb" />
                        <span className="icon-label">Time Bomb</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
