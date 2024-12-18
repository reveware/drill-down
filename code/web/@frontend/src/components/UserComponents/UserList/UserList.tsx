import React from 'react';
import { UserOverview } from '@drill-down/interfaces';
import './UserList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppRoutes } from '../../../Routes';
import { Avatar } from '../../..//components';
import { useNavigate } from 'react-router-dom';
import { useAddFriendRequestMutation, useApproveFriendRequestMutation, useRejectFriendRequestMutation, useRemoveFriendMutation } from 'src/hooks';
import { selectLoggedInUser, useAppSelector } from 'src/store';

type ListUser = UserOverview & { is_friend?: boolean, is_pending_friend?: boolean }
interface UserListProps {
    users: ListUser[];
}
export const UserList: React.FC<UserListProps> = (props) => {
    const { users } = props;
    const navigate = useNavigate();
    const loggedInUser = useAppSelector(selectLoggedInUser)

    const [addFriendRequest] = useAddFriendRequestMutation()
    const [approveFriendRequest] = useApproveFriendRequestMutation();
    const [rejectFriendRequest] = useRejectFriendRequestMutation();
    const [removeFriend] = useRemoveFriendMutation();
    

    if (!loggedInUser) {
        return null;
    }

    const handleSendMessage = () => {
        alert('chat not implemented')
     }
    const handleSendTimeBomb = () => { 
        alert('timebomb not implemented')
    }
    
    // TODO: handle catch on actions (https://trello.com/c/YZby4Xz9)
    const handleAddFriendRequest = async (username: string) => {
        try {
            await addFriendRequest({ request: { username }, loggedInUser }).unwrap()
        } catch (error) {

        }
    }

    const handleRejectFriendRequest = async (username: string) => {
        try {
            await rejectFriendRequest({ request: { username }, loggedInUser }).unwrap()
        } catch (error) {

        }
    }

    const handleApproveFriendRequest = async (username: string) => {
        try {
            await approveFriendRequest({ request: { username }, loggedInUser }).unwrap()
        } catch (error) {

        }
    }

    const handleRemoveFriend = async (username: string) => {
        try {
            await removeFriend({ request: { username }, loggedInUser }).unwrap()
        } catch (error) {

        }
    }

    const renderActions = (user: ListUser) => {
        if (user.is_friend) {
            return FriendActions(user)
        }

        if (user.is_pending_friend) {
            return FriendRequestActions(user)
        }

            return DefaultActions(user);
        }

    const FriendActions = (user: ListUser) => (
        <div className="user-actions">
            <span className="action-label" onClick={() => handleSendMessage()}><FontAwesomeIcon className="action-icon" icon="comment-alt" />Message</span>
            <span className="action-label" onClick={() => handleSendTimeBomb()}><FontAwesomeIcon className="action-icon" icon="bomb" />Time Bomb</span>
            <span className="action-label" onClick={() => handleRemoveFriend(user.username)}><FontAwesomeIcon className="action-icon" icon="user-slash" />Remove</span>
        </div>
    )

    const FriendRequestActions = (user: ListUser) => (
        <div className="user-actions">
            <span className="action-label"  onClick={() => handleRejectFriendRequest(user.username)}><FontAwesomeIcon className="action-icon" icon="user-slash" />Reject</span>
            <span className="action-label" onClick={() => handleApproveFriendRequest(user.username)}><FontAwesomeIcon className="action-icon" icon="user-plus" />Approve</span>
        </div>
    )

    const DefaultActions = (user: ListUser) => (
        <div className="user-actions">
            <span className="action-label" onClick={() => handleAddFriendRequest(user.username)}><FontAwesomeIcon className="action-icon" icon="user-plus" />Add Friend</span>
        </div>
    )

    
    return (
        <div className="userlist">
            {users.map((user, i) => (
                <div className="userlist-item" key={i}>
                    <div className="user-info pointer"
                        onClick={() => navigate(AppRoutes.USER_PROFILE.replace(':username', user.username))}>
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
                    {renderActions(user)}
                </div>
            ))}
        </div>
    );
};
