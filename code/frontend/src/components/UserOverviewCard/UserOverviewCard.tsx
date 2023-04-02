import React from 'react';
import { User, Populated } from '@drill-down/common';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, TextBox } from '../../components';
import { selectLoggedInUser } from '../../store';
import './UserOverviewCard.scss';
import { history } from '../../App';
import { AppRoutes } from 'src/Routes';

interface UserOverviewCardProps {
    user: Populated<User>;
}
export const UserOverviewCard: React.FC<UserOverviewCardProps> = (props) => {
    const currentUser = useSelector(selectLoggedInUser);
    const { user } = props;

    const isMySelf = user._id === currentUser?._id;

    const handleChatClick = () => {
        history.push(AppRoutes.CHAT);
    };
    return (
        <Card className="user-overview-card">
            <div className="overview-avatar">
                <Avatar style="circle" source={user.avatar} />
            </div>

            <div className="user-profile-details">
                <div>
                    <h2>{user.username}</h2>

                    <h1>{`${user.firstName} ${user.lastName}`}</h1>
                    {user.tagLine && (
                        <div>
                            <TextBox className="text-muted" text={user.tagLine} maxLength={100} />
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
                        <div className="pointer">
                            <FontAwesomeIcon className="action-icon" size="lg" icon="user-friends" />
                            <span className="icon-label">Befriend</span>
                        </div>
                    )}

                    <div className="pointer">
                        <FontAwesomeIcon className="action-icon" size="lg" icon="comment-alt" />
                        <span className="icon-label" onClick={handleChatClick}>
                            Message
                        </span>
                    </div>
                    <div className="pointer">
                        <FontAwesomeIcon className="action-icon" size="lg" icon="bomb" />
                        <span className="icon-label">Time Bomb</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
