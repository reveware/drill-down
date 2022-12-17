import React, { useState } from 'react';
import { useEffect } from 'react';
import { Card, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { UserList, PostCardGrid, UserOverviewCard } from '../../components';
import { fetchPostsForUser, fetchUserById, selectPostsByUser, selectUserByUsername } from '../../store';
import { AppState } from '../../store/store.type';
import './UserProfile.scss';

enum ProfileTabs {
    POSTS = 'POSTS',
    CHARTS = 'CHARTS',
    FRIENDS = 'FRIENDS',
}

export const UserProfile: React.FC = () => {
    const params = useParams<{ username: string }>();
    const { username } = params;
    const mastheadPhoto = 'https://images8.alphacoders.com/442/thumb-1920-442066.jpg';
    const dispatch = useDispatch();

    const user = useSelector((state: AppState) => selectUserByUsername(state, username));
    const { isLoading, error } = useSelector((state: AppState) => state.users);
    const posts = useSelector((state: AppState) => selectPostsByUser(state, username));
    const [selectedTab, setSelectedTab] = useState<string | null>(ProfileTabs.POSTS);

    useEffect(() => {
        dispatch(fetchUserById(username));
        dispatch(fetchPostsForUser(username));
    }, []);

    // TODO: use loader component
    if (isLoading) {
        return <div>loading</div>;
    }

    // TODO: use image asset
    if (!user) {
        return (
            <Card>
                <Card.Body>Hmm, we got nothing on {username} </Card.Body>
            </Card>
        );
    }

    return (
        <React.Fragment>
          <div className="user-profile">
                        <div className="user-profile-masthead-photo">
                            {/*TODO: Allow users to set their photo */}
                            <img src={mastheadPhoto} />
                        </div>

                        <div className="user-profile-content">
                            <UserOverviewCard user={user} />
                            <Card className="user-profile-content-card">
                                <Card.Body>
                                <Tabs activeKey={selectedTab as any} onSelect={(key) => setSelectedTab(key)} className="user-profile-tabs">
                                    <Tab eventKey={ProfileTabs.POSTS} title="Posts">
                                        <div className="profile-tab">
                                            <PostCardGrid className="user-profile-posts" postSize="sm" posts={posts} />
                                        </div>
                                    </Tab>

                                    <Tab eventKey={ProfileTabs.CHARTS} title="Charts">
                                        <div className="profile-tab">recharts tag count by date timeline, comparisson pie chart</div>
                                    </Tab>

                                    <Tab eventKey={ProfileTabs.FRIENDS} title="Friends">
                                        <div className="profile-tab">
                                            <UserList users={new Array(150).fill(user)} />
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
