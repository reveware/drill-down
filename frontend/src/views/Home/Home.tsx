import React, { useEffect } from 'react';
import { FloatingActionsMenu, PostCardGrid, TagCloud } from '../../components';
import './Home.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store';
import { getUserPosts, getPostsCountByTag } from '../../store/actions';
import { useHistory } from 'react-router-dom';
import { AppRoutes } from '../../Routes';

export const Home = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector((appState: AppState) => appState.user);
    const { userPosts, postCountByTag } = useSelector((appState: AppState) => appState.posts);

    const reversed = userPosts.slice(0).reverse();

    useEffect(() => {        
        const isStoreValid = !!(userPosts && postCountByTag);
        if (user && user.username && !isStoreValid) {
            dispatch(getUserPosts(user.username));
            dispatch(getPostsCountByTag(user.username));
        }
    }, []);

    const onTagClicked = (tag: string) => {
        history.push(AppRoutes.POSTS_FOR_TAG.replace(':tag', tag));
    };

    return (
        <div className="home-view">
            {postCountByTag && <TagCloud postsCountByTags={postCountByTag} onTagClicked={onTagClicked} />}

            <div className="user-posts">
                <PostCardGrid id="latest-posts" title="Latest" posts={userPosts} />

                <PostCardGrid id="starred-posts" title="Starred" posts={reversed} />
            </div>

            <FloatingActionsMenu />
        </div>
    );
};
