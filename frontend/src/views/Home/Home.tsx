import React, { useEffect } from 'react';
import { FloatingActionsMenu, PostCardGrid, TagCloud } from '../../components';
import './Home.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppRoutes } from '../../Routes';
import { AppState } from '../../store/store.type';
import { fetchPostsForUser, selectLoggedInUser, selectPostsByUser } from '../../store';
import { useState } from 'react';
import { CountByTag } from '@drill-down/interfaces';
import { AppService } from '../../services';

export const Home = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector(selectLoggedInUser);

    const isLoading = useSelector((state: AppState) => state.posts.isLoading);
    const userPosts = useSelector((state: AppState)=> selectPostsByUser(state, user ? user.username : ""));

    const [postCountByTag, setPostCountByTag] = useState<CountByTag[]>([]);

    const getPostsCountByTag = async (username: string) => {
        try {
            const appService = new AppService();
            const counts = await appService.getPostsCountByTag(username);
            setPostCountByTag(counts);
        } catch (e) {
            console.log('Error getting post count by tag:', e.message);
        }
    };

    useEffect(() => {
        if (user) {
            dispatch(fetchPostsForUser(user.username));
            getPostsCountByTag(user.username);
        }
    }, [user, dispatch]);

    const onTagClicked = (tag: string) => {
        history.push(AppRoutes.POSTS_FOR_TAG.replace(':tag', tag));
    };

    if (isLoading) {
        return <p>Loading</p>;
    }

    if (!userPosts) {
        return null;
    }

    const reversed = userPosts.slice(0).reverse();

    return (
        <div className="home-view">
            <TagCloud className="tag-cloud neon-border" postsCountByTags={postCountByTag} onTagClicked={onTagClicked} />
            <div className="user-posts">
                <PostCardGrid className="latests-posts neon-border" title="Latest" posts={userPosts} />

                {<PostCardGrid className="starred-posts neon-border" title="Starred" posts={reversed} />}
            </div>
            <FloatingActionsMenu />
        </div>
    );
};
