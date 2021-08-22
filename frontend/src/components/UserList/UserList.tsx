import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { Populated, User } from '@drill-down/interfaces';
import './UserList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { history } from '../../App';
import { AppRoutes } from '../../Routes';

interface UserListProps {
    users: Populated<User>[];
}
export const UserList: React.FC<UserListProps> = (props) => {
    const { users } = props;

    return (
        <div className="userlist">
            {users.map((user) => (
                <div className="userlist-item">
                    <div
                        className="user-info pointer"
                        onClick={() => history.push(AppRoutes.USER_PROFILE.replace('username', user.username))}>
                        <div className="user-avatar">
                            <img src={user.avatar} alt={user.username} />
                        </div>
                        <div className="user-details ">
                            <div className="user-name">
                                <span>{user.firstName}</span> <span> {user.lastName}</span>
                            </div>

                            <div className="user-tagline">{user.tagLine}</div>
                        </div>
                    </div>

                    <div className="user-actions">
                        <div className="pointer">
                            <FontAwesomeIcon className="action-icon" size="sm" icon="comment-alt" />
                            <span className="icon-label">Message</span>
                        </div>
                        <div className="pointer">
                            <FontAwesomeIcon className="action-icon" size="sm" icon="user-friends" />
                            <span className="icon-label">Befriend</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
