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
    const username = params.username!;

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
        <div className="user-profile">
            <div className="user-profile-masthead-photo">
                {/*TODO: Allow users to set their photo */}
                <img src={mastheadPhoto} alt="masthead" />
            </div>

            <div className="user-profile-content">
                <div className="user-profile-overview ">
                    <UserOverviewCard className='neon-border' user={user} />
                    <TagCloud className='neon-border' tagCount={user.posts_per_tag} />
                </div>

                <Card className="user-profile-main neon-border">
                    <Card.Body className="user-profile-card-body">
                        <Tabs
                            activeKey={selectedTab as any}
                            onSelect={(key) => setSelectedTab(key)}
                            className="user-profile-tabs"
                            mountOnEnter
                            unmountOnExit>
                            <Tab className="user-profile-tab" eventKey={ProfileTabs.POSTS} title="Posts">
                                <PostCardGrid postSize="sm" posts={user.posts} onClick={(e) => alert('not triggering')} />
                            </Tab>

                            <Tab className="user-profile-tab" eventKey={ProfileTabs.FRIENDS} title="Friends">
                                <UserList users={user.friends} />
                            </Tab>

                            <Tab className="user-profile-tab" eventKey={ProfileTabs.ROOM} title="Room">
                                <UserRoom user={user} />
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};
