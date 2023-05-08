import React, { useState } from 'react';
import { Card, Tabs, Tab } from 'react-bootstrap';
import { selectLoggedInUser, useAppSelector } from 'src/store';
import { useGetUserDetailQuery } from 'src/hooks';
import { useParams } from 'react-router-dom';
import { UserList, PostCardGrid, UserOverviewCard, UserRoom, NotFound, TagCloud, Loading } from '../../components';
import './UserProfile.scss';

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
    // TODO: handle errors
    const { data: user, isLoading } = useGetUserDetailQuery({ username });
    const loggedInUser = useAppSelector(selectLoggedInUser);

    const [selectedTab, setSelectedTab] = useState<string | null>(ProfileTabs.POSTS);
    const isMySelf = loggedInUser?.id === user?.id;

    if (isLoading) {
        return <Loading />;
    }

    if (!user) {
        return <NotFound />;
    }

    return (
        <React.Fragment>
            <div className="user-profile">
                <div className="user-profile-masthead-photo">
                    {/*TODO: Allow users to set their photo */}
                    <img src={mastheadPhoto} alt="masthead" />
                </div>

                <div className="user-profile-content">
                    <div className="user-profile-overview">
                        <UserOverviewCard user={user} />
                        <TagCloud tagCount={user.posts_per_tag} />
                    </div>

                    <Card className="user-profile-main">
                        <Card.Body className="user-profile-card-body">
                            <Tabs
                                activeKey={selectedTab as any}
                                onSelect={(key) => setSelectedTab(key)}
                                className="user-profile-tabs"
                                mountOnEnter
                                unmountOnExit>
                                <Tab eventKey={ProfileTabs.POSTS} title="Posts">
                                    <div className="user-profile-tab">
                                        <PostCardGrid postSize="sm" posts={user.posts} onClick={(e) => alert('not triggering')} />
                                    </div>
                                </Tab>

                                <Tab eventKey={ProfileTabs.FRIENDS} title="Friends">
                                    <div className="user-profile-tab">
                                        <UserList users={user.friends} />
                                    </div>
                                </Tab>

                                <Tab eventKey={ProfileTabs.ROOM} title="Room">
                                    <div className="user-profile-tab" onClick={(e) => alert('this click')}>
                                        <UserRoom user={user} />
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
};
