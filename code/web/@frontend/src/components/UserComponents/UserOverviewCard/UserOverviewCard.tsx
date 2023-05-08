import React from 'react';
import { UserDetail } from '@drill-down/interfaces';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, TextBox } from '../../../components';
import { selectLoggedInUser } from '../../../store';
import './UserOverviewCard.scss';
import { history } from '../../../App';
import { AppRoutes } from 'src/Routes';

interface UserOverviewCardProps {
    user: UserDetail;
    className?: string;
}
export const UserOverviewCard: React.FC<UserOverviewCardProps> = (props) => {
    const currentUser = useSelector(selectLoggedInUser);
    const { user, className } = props;

    const isMySelf = user.id === currentUser?.id;

    const handleChatClick = () => {
        history.push(AppRoutes.CHAT);
    };

    const handleFriendRequest = ()=> {
        alert('add as friend');
    }

    const handleSendTimeBomb = ()=> {
        alert('show timebomb creation modal')
    }

    return (
        <Card className={`user-overview-card ${className || ""}`}>
            <div className="overview-avatar">
                <Avatar type="circle" source={user.avatar} />
            </div>

            <div className="user-profile-details">
                <div>
                    <h2>{user.username}</h2>

                    <h1>{`${user.first_name} ${user.last_name}`}</h1>
                    {user.tagline && (
                        <div>
                            <TextBox className="text-muted" text={user.tagline} maxLength={100} />
                        </div>
                    )}
                </div>
                <div className="user-profile-stats">
                    <span>Friends: {user.friends.length}</span>
                    <span>Likes: {user.likes.length} </span>
                </div>

                <hr />

                <div className="user-profile-actions">
                    {!isMySelf && (
                        <div className="pointer" onClick={handleFriendRequest}>
                            <FontAwesomeIcon className="action-icon" size="lg" icon="user-friends" />
                            <span className="icon-label">Befriend</span>
                        </div>
                    )}

                    <div className="pointer" onClick={handleChatClick}>
                        <FontAwesomeIcon className="action-icon" size="lg" icon="comment-alt" />
                        <span className="icon-label">
                            Message
                        </span>
                    </div>
                    <div className="pointer" onClick={handleSendTimeBomb}>
                        <FontAwesomeIcon className="action-icon" size="lg" icon="bomb" />
                        <span className="icon-label">Time Bomb</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
