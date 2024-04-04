import React, { useState } from 'react';
import { useGetPendingFriendsQuery, useGetUserFriendsQuery } from 'src/hooks';
import { useParams } from 'react-router-dom';
import { NotFound, Loading, UserList } from '../../components';
import './UserFriends.scss';
import { selectLoggedInUser, useAppSelector } from 'src/store';
import { Card } from 'react-bootstrap';

export const UserFriends: React.FC = () => {
    const params = useParams<{ username: string }>();
    const username = params.username!;
    const loggedInUser = useAppSelector(selectLoggedInUser);
    const isMySelf = loggedInUser?.username === username;
    let { data: friendRequests, isLoading: isFetchingFriendRequests } = useGetPendingFriendsQuery({ username }, { skip: !isMySelf });
    let { data: friends, isLoading: isFetchingFriends } = useGetUserFriendsQuery({ username })

    if (isFetchingFriends || isFetchingFriendRequests) {
        return <Loading />;
    }

    if (!friends) {
        return null;
    }

    friendRequests = friendRequests?.map((u) => ({ ...u, is_pending_friend: true }))
    friends = friends?.map((u) => ({ ...u, is_friend: true }))

    return (
        <div className="user-friends">
            <Card className="user-friends-main neon-border">
                <Card.Body>
                    {friendRequests && friendRequests.length > 0 && (
                        <div>
                            <h2>Pending Requests:</h2>
                            <UserList users={friendRequests} />
                            <hr />
                        </div>)}

                    {
                        friends && friends.length > 0 && (
                            <div>
                                <h2>Friends:</h2>
                                <UserList users={friends} />
                            </div>
                        )
                    }


                </Card.Body>
            </Card>
        </div>
    );
};
