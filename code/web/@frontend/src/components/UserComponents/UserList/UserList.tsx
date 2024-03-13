import React from 'react';
import { UserOverview } from '@drill-down/interfaces';
import './UserList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppRoutes } from '../../../Routes';
import { Avatar } from '../../..//components';
import { useNavigate } from 'react-router-dom';

interface UserListProps {
    users: UserOverview[];
}
export const UserList: React.FC<UserListProps> = (props) => {
    const {users} = props;
    const navigate = useNavigate();
    return (
        <div className="userlist">
            {users.map((user, i) => (
                <div className="userlist-item" key={i}>
                    <div
                        className="user-info pointer"
                        onClick={() => navigate(AppRoutes.USER_PROFILE.replace('username', user.username))}>
                        <div className="user-avatar">
                            <Avatar source={user.avatar} type="square" border={false} />
                        </div>
                        <div className="user-details ">
                            <div className="user-name">
                                <span>{user.first_name}</span> <span> {user.last_name}</span>
                            </div>

                            <div className="user-tagline">{user.tagline}</div>
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
