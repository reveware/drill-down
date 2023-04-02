import React, { useState } from 'react';
import { useEffect } from 'react';
import { Card, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { UserList, PostCardGrid, UserOverviewCard, UserRoom, NotFound, TagCloud, NoPostsFound } from '../../components';
import { fetchPostsForUser, fetchUserByUsername, selectPostsByUser, selectUserByUsername, selectLoggedInUser } from '../../store';
import { AppState } from '../../store/store.type';
import './UserProfile.scss';
import { useUserTagCount } from 'src/hooks';

enum ProfileTabs {
    POSTS = 'POSTS',
    ROOM = 'ROOM',
    FRIENDS = 'FRIENDS',
    MANAGE_ASSETS = 'MANAGE_ASSETS',
}

export const UserProfile: React.FC = () => {
    const params = useParams<{ username: string }>();
    const { username } = params;
    const mastheadPhoto = 'https://images8.alphacoders.com/442/thumb-1920-442066.jpg';
    const dispatch = useDispatch();
    const currentUser = useSelector(selectLoggedInUser);
    const user = useSelector((state: AppState) => selectUserByUsername(state, username));
    const { isLoading, error } = useSelector((state: AppState) => state.users);
    const posts = useSelector((state: AppState) => selectPostsByUser(state, username));
    
    const [selectedTab, setSelectedTab] = useState<string | null>(ProfileTabs.POSTS);
    const isMySelf = currentUser?._id == user?._id;

    // TODO: move to custom hook "useUserProfile (maybe combine with useUserPostCount)"
    useEffect(() => {
        dispatch(fetchUserByUsername(username));
        dispatch(fetchPostsForUser(username));
    }, []);

    // TODO: use loader component
    if (isLoading) {
        return <div>loading</div>;
    }

    if (!user) {
        return <NotFound />;
    }

    return (
        <React.Fragment>
            <div className="user-profile">
                <div className="user-profile-masthead-photo">
                    {/*TODO: Allow users to set their photo */}
                    <img src={mastheadPhoto} />
                </div>

                <div className="user-profile-content">
                    <div className='user-profile-content-overview'>
                        <UserOverviewCard user={user} />
                        <TagCloud username={user.username} />
                    </div>

                    <Card className="user-profile-content-main">
                        <Card.Body>
                            <Tabs activeKey={selectedTab as any} onSelect={(key) => setSelectedTab(key)} className="user-profile-tabs">
                                <Tab eventKey={ProfileTabs.POSTS} title="Posts">
                                    <div className="profile-tab">
                                        {<NoPostsFound username={user.username}/>}
                                        <PostCardGrid className="user-profile-posts" postSize="sm" posts={posts} />
                                    </div>
                                </Tab>

                                <Tab eventKey={ProfileTabs.FRIENDS} title="Friends">
                                    <div className="profile-tab">
                                        <UserList users={new Array(150).fill(user)} />
                                    </div>
                                </Tab>

                                <Tab eventKey={ProfileTabs.ROOM} title="Room">
                                    <div className="profile-tab">
                                        <UserRoom user={user} />
                                    </div>
                                </Tab>

                                {isMySelf && (
                                    <Tab eventKey={ProfileTabs.MANAGE_ASSETS} title="Manage Assets">
                                        <div className="profile-tab">
                                            Shows a grid of owned assets, and the ability to include/exclude them from the room{' '}
                                        </div>
                                    </Tab>
                                )}
                            </Tabs>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
};
