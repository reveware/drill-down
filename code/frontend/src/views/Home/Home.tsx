import React, { useEffect } from 'react';
import { FloatingActionsMenu, PostCardGrid, NoContent } from '../../components';
import './Home.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/store.type';
import { fetchPostsForUser, selectLoggedInUser, selectPostsByUser } from '../../store';
import _ from 'lodash';

export const Home = () => {
    const dispatch = useDispatch();

    const user = useSelector(selectLoggedInUser);

    const isLoading = useSelector((state: AppState) => state.posts.isLoading);
    const postsForUser = useSelector((state: AppState) => selectPostsByUser(state, user ? user.username : ''));

    useEffect(() => {
        if (user) {
            dispatch(fetchPostsForUser(user.id));
        }
    }, [user, dispatch]);


    if (isLoading) {
        return <p>Loading</p>;
    }

    if(!user) {
        return null;
    }

    if (_.isEmpty(postsForUser)) {
        return <NoContent/>
    }

    const reversed = postsForUser.slice(0).reverse();

    return (
        <div className="home-view">
            <div className="user-posts">
                <PostCardGrid title="Latest Posts" className="latest-posts neon-border" posts={postsForUser} postSize="md" />

                <PostCardGrid title="starred Posts" className="neon-border" posts={reversed} />
            </div>
            <FloatingActionsMenu />
        </div>
    );
};
