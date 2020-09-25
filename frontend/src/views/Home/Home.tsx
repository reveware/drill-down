import React, {useEffect} from 'react';
import {PostGrid, TagCloud} from '../../components';
import './Home.scss';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {getUserPosts, getPostsCountByTag} from "../../store/actions";

export const Home = () => {
    const dispatch = useDispatch();
    const {user} = useSelector((appState: AppState) => appState.user);
    const {userPosts, postCountByTag} = useSelector((appState: AppState) => appState.posts);

    const reversed = userPosts.slice(0).reverse();

    useEffect(() => {
        if (user && user.username) {
            dispatch(getUserPosts(user.username));
            dispatch(getPostsCountByTag(user.username));
        }
    }, [])


    return (
        <div className="home-view">
            {postCountByTag && (
                <TagCloud postsCountByTags={postCountByTag}/>
            )}

            <div className="user-posts">
                <PostGrid id="starred-posts" title="Starred" posts={userPosts}/>

                <PostGrid id="common-posts" title="Common" posts={reversed}/>
            </div>
        </div>
    );
};
