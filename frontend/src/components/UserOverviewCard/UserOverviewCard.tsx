import React from 'react';
import { User, Populated } from '@drill-down/interfaces';
import { Card, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PostCardGrid, TextBox } from '../../components';
import { selectLoggedInUser } from '../../store';
import './UserOverviewCard.scss';

interface UserOverviewCardProps {
    user: Populated<User>;
}
export const UserOverviewCard: React.FC<UserOverviewCardProps> = (props) => {
    const currentUser = useSelector(selectLoggedInUser);
    const {user} = props;

    return (
        <Card className="user-overview-card">
            <div className="user-profile-photo">
                <img src={user.avatar} />
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
                    <span>Likes: {(user as any).likes} </span> {/*TODO: add likes to model */}
                </div>

                <div className="user-profile-actions">
                    <div className="pointer">
                        <FontAwesomeIcon className="action-icon" size="lg" icon="user-friends" />
                        <span className="icon-label">Befriend</span>
                    </div>

                    <div className="pointer">
                        <FontAwesomeIcon className="action-icon" size="lg" icon="comment-alt" />
                        <span className="icon-label">Message</span>
                    </div>
                    <div className="pointer">
                        <FontAwesomeIcon className="action-icon" size="lg" icon="bomb" />
                        <span className="icon-label">Set Time Bomb</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
