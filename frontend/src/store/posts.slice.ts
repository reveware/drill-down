import { createEntityAdapter, createAsyncThunk, createSlice, EntityState, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { CustomError, Populated, Post } from '@drill-down/interfaces';
import { history } from '../App';
import { AppRoutes } from '../Routes';
import { AppService } from '../services';
import { ToastService } from '../services/ToastService';
import { AppState } from './store.type';

type PostsState = EntityState<Populated<Post>> & {
    isLoading: boolean;
    error: null | CustomError;
    selectedPost: null | string;
};

const postsAdapter = createEntityAdapter<Populated<Post>>({
    selectId: (post) => post._id,
    sortComparer: (a, b) => b.createdAt - a.createdAt,
});

const initialState: PostsState = postsAdapter.getInitialState({
    isLoading: false,
    error: null,
    selectedPost: null,
});

export const fetchPostsForUser = createAsyncThunk('posts/fetchPostsForUser', async (username: string, { rejectWithValue }) => {
    try {
        return await AppService.getUserPosts(username);
    } catch (e) {
        return rejectWithValue(AppService.makeError('getPostsForUser', e));
    }
});

export const fetchPostsForTag = createAsyncThunk('posts/fetchPostsWithTag', async (tag: string, { rejectWithValue }) => {
    try {
        return await AppService.getPostsForTag(tag);
    } catch (e) {
        return rejectWithValue(AppService.makeError('fetchPostsWithTag', e));
    }
});

export const createPhotoPost = createAsyncThunk(
    'posts/createPhotoPost',
    async (post: { photos: File[]; description: string; tags: string[] }, { rejectWithValue }) => {
        try {
            const newPost = await AppService.createPhotoPost(post);
            history.push(AppRoutes.HOME);
            return newPost;
        } catch (e) {
            const customError = AppService.makeError('createPhotoPost', e);
            ToastService.error(customError);
            return rejectWithValue(customError as CustomError);
        }
    }
);

export const createComment = createAsyncThunk(
    'posts/createComment',
    async (comment: { message: string; replyTo: string | null; postId: string }, { rejectWithValue }) => {
        try {
            const newComment = await AppService.createComment(comment);
            return newComment;
        } catch (e) {
            const customError = AppService.makeError('createComment', e);
            ToastService.error(customError);
            return rejectWithValue(customError);
        }
    }
);

export const deletePost = createAsyncThunk('post/deletePost', async (id: string, { rejectWithValue }) => {
    try {
        await AppService.deletePost(id);
        ToastService.success({title: 'Post deleted!', message: 'You will never see it again'});
        return id;
    } catch (e) {
        const customError = AppService.makeError('deletePost', e);
        ToastService.error(customError);
        return rejectWithValue(customError);
    }
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setSelectedPost(state, action: PayloadAction<null | string>) {
            state.selectedPost = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsForUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(fetchPostsForUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as CustomError;
            })

            .addCase(fetchPostsForUser.fulfilled, (state, action) => {
                state.isLoading = false;
                postsAdapter.upsertMany(state, action.payload);
            })

            .addCase(fetchPostsForTag.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })

            .addCase(fetchPostsForTag.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as CustomError;
            })

            .addCase(fetchPostsForTag.fulfilled, (state, action) => {
                state.isLoading = false;
                postsAdapter.upsertMany(state, action.payload);
            })

            .addCase(createComment.fulfilled, (state, action) => {
                const updatedPostId = action.payload.postId;
                const updatedPost = state.entities[updatedPostId];
                updatedPost?.comments.push(action.payload);
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                const deletePostId = action.payload;
                postsAdapter.removeOne(state, deletePostId);
            });
    },
});

export const { reducer: postsReducer } = postsSlice;
export const { setSelectedPost } = postsSlice.actions;

export const { selectAll: selectAllPosts, selectById: selectPostById } = postsAdapter.getSelectors((state: AppState) => state.posts);

export const selectPostsByUser = createSelector([selectAllPosts, (state: AppState, username: string) => username], (posts, username) =>
    posts.filter((post) => post.author.username === username)
);

export const selectPostsForTag = createSelector([selectAllPosts, (state: AppState, tag: string) => tag], (posts, tag) =>
    posts.filter((post) => post.tags.includes(tag))
);
