import React, {useEffect} from 'react';
import {PostGrid} from '../../components';
import './Home.scss';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {getUserPosts} from "../../store/actions/posts.actions";

export const Home = () => {
    const dispatch = useDispatch();
    const user = useSelector((appState: AppState) => appState.user);
    const posts = useSelector((appState: AppState) => appState.posts);

    const reversed = posts.userPosts.slice(0).reverse();

    useEffect(() => {
        if (user && user.user && user.user.username) {
            dispatch(getUserPosts(user.user.username));
        }
    }, [])


    return (
        <div className="home-view">
            <PostGrid id="starred-posts" title="Starred" posts={posts.userPosts}/>

            <PostGrid id="common-posts" title="Common" posts={reversed}/>
        </div>
    );
};
