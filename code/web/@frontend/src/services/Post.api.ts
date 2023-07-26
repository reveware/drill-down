import { createApi } from '@reduxjs/toolkit/query/react';
import {
    GetPosts,
    GetPostDetail,
    CreatePhotoPost,
    DeletePost,
    PostDetail,
    PostOverview,
    Comment,
    CreateComment,
    CreateQuotePost,
} from '@drill-down/interfaces';
import { customFetchBaseQuery } from './customFetchBaseQuery';
import { UserApiTags } from './User.api';

export enum PostApiTags {
    OVERVIEW = 'PostOverview',
    DETAIL = 'PostDetail',
}

export const PostsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: customFetchBaseQuery('posts'),
    tagTypes: [PostApiTags.OVERVIEW, PostApiTags.DETAIL],
    endpoints: (builder) => ({
        /** Create Post  **/
        createPhotoPost: builder.mutation<PostOverview, CreatePhotoPost.Request>({
            query: (request) => {
                const { description, tags, photos } = request;
                const formData = new FormData();
                description && formData.append('description', description);
                photos.forEach((file: File) => {
                    formData.append('photos', file, file.name);
                });
                tags.forEach((tag) => {
                    formData.append('tags[]', tag);
                });

                return {
                    url: `/photo`,
                    method: 'POST',
                    body: formData,
                };
            },
            transformResponse: (response: CreatePhotoPost.Response) => response.data,
            invalidatesTags: [{ type: PostApiTags.OVERVIEW, id: 'TRIGGER' }],
        }),

        createQuotePost: builder.mutation<PostOverview, CreateQuotePost.Request>({
            query: (request) => {
                return { url: `/quote`, method: 'POST', body: request };
            },
            transformResponse: (response: CreateQuotePost.Response) => response.data,
            invalidatesTags: [{ type: PostApiTags.OVERVIEW, id: 'TRIGGER' }],
        }),
        /** Get Posts **/
        getPosts: builder.query<PostOverview[], GetPosts.Request>({
            query: (request) => {
                const params = {
                    id: request.id?.toString() || null,
                    tags: request.tags || null,
                    author: request.author || null,
                    created_before: request.created_after?.toISOString() || null,
                    created_after: request.created_after?.toISOString() || null,
                    page_number: request.page_number?.toString() || null,
                    page_size: request.page_size?.toString() || null,
                };

                const queryParams = new URLSearchParams();

                Object.entries(params).forEach(([key, value]) => {
                    if (value) {
                        queryParams.append(key, value);
                    }
                });

                return {
                    url: `?${queryParams}`,
                    method: 'GET',
                };
            },
            transformResponse: (response: GetPosts.Response) => response.data,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: PostApiTags.OVERVIEW, id }), { type: PostApiTags.OVERVIEW, id: 'TRIGGER' }),
                          // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'TRIGGER' }` is invalidated
                      ]
                    : [{ type: PostApiTags.OVERVIEW, id: 'TRIGGER' }],
        }),
        /** Get Post Detail**/
        getPostDetail: builder.query<PostDetail, GetPostDetail.Request>({
            query: (request) => {
                const { id } = request;
                return {
                    url: `/${id}`,
                    method: 'GET',
                };
            },
            transformResponse: (response: GetPostDetail.Response) => response.data,
            providesTags: (result) => (result ? [{ type: PostApiTags.DETAIL, id: result.id }] : []),
        }),
        /** Delete Post & Comments **/
        deletePost: builder.mutation<boolean, DeletePost.Request>({
            query(request) {
                const { id } = request;
                return {
                    url: `/${id}`,
                    method: 'DELETE',
                };
            },
            transformResponse: (response: DeletePost.Response) => response.deleted,
            invalidatesTags: (result, error, request) => [
                { type: PostApiTags.OVERVIEW, id: request.id },
                { type: PostApiTags.DETAIL, id: request.id },
                { type: UserApiTags.DETAIL } as any,
            ],
        }),
        /** Create Comment**/
        createComment: builder.mutation<Comment, { post: number; comment: CreateComment.Request }>({
            query: (request) => {
                return {
                    url: `/${request.post}/comments`,
                    method: 'PUT',
                    body: request.comment,
                };
            },
            transformResponse: (response: CreateComment.Response) => response.data,
            invalidatesTags: (result, error, request) => [{ type: PostApiTags.DETAIL, id: request.post }],
        }),
    }),
});
