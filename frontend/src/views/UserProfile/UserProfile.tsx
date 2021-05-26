import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useEffect } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TextBox } from '../../components';
import { fetchUserById, selectLoggedInUser, selectUserByUsername } from '../../store';
import { AppState } from '../../store/store.type';
import './UserProfile.scss';

export const UserProfile: React.FC = () => {
    const params = useParams<{ username: string }>();
    const { username } = params;

    const dispatch = useDispatch();
    const currentUser = useSelector(selectLoggedInUser);
    const user = useSelector((state: AppState) => selectUserByUsername(state, username));
    const { isLoading, error } = useSelector((state: AppState) => state.users);

    useEffect(() => {
        dispatch(fetchUserById(username));
    }, []);

    if (isLoading) {
        return <div>loading</div>;
    }

    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    {user ? (
                        <div className="user-profile">
                            <div className="user-profile-masthead-photo">
                                {/*TODO: Allow users to set their photo */}
                                <img src={'https://images8.alphacoders.com/442/thumb-1920-442066.jpg'} />
                            </div>

                            <Card className="user-profile-panel">
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
                        </div>
                    ) : (
                        <div>Hmm, we got nothing on {username} </div>
                    )}
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};
