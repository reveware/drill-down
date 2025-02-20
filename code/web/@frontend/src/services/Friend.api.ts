import { createApi } from '@reduxjs/toolkit/query/react';
import { GetFriends, AddFriend, DeleteFriend, UserOverview } from '@drill-down/interfaces';
import { customFetchBaseQuery } from './customFetchBaseQuery';

export enum FriendApiTags {
    PENDING = 'PENDING',
    LIST = 'LIST'
}

export const FriendsApi = createApi({
    reducerPath: 'friendsApi',
    baseQuery: customFetchBaseQuery('friends'),
    tagTypes: [FriendApiTags.PENDING, FriendApiTags.LIST],
    endpoints: (builder) => ({
        /** Get Friend Request **/
        getPendingFriends: builder.query<UserOverview[], GetFriends.Request>({
            query: (request) => {
                console.log('getting friend request', { request })

                const params = {
                    page_number: request.page_number?.toString(),
                    page_size: request?.page_size?.toString()
                }

                const queryParams = new URLSearchParams()

                Object.entries(params).forEach(([key, value]) => {
                    if (value) {
                        queryParams.append(key, value);
                    }
                });

                return {
                    url: `/pending/${queryParams}`,
                    method: 'GET',

                };
            },
            transformResponse: (response: GetFriends.Response) => response.data || [],
            providesTags: (result, error, { username }) => (result ? [{ type: FriendApiTags.PENDING }] : [])
        }),

        /** Get User Friends**/
        getUserFriends: builder.query<UserOverview[], GetFriends.Request>({
            query: (request) => {
                console.log('getting friends', { request })
                const { username } = request;

                const params = {
                    page_number: request.page_number?.toString(),
                    page_size: request?.page_size?.toString()
                }

                const queryParams = new URLSearchParams()

                Object.entries(params).forEach(([key, value]) => {
                    if (value) {
                        queryParams.append(key, value);
                    }
                });

                return {
                    url: `/${username}?${queryParams}`,

                }
            },
            transformResponse: (response: GetFriends.Response) => response.data || [],
            providesTags: (result, error, { username }) => (result ? [{ type: FriendApiTags.LIST, id: username }] : [])
        }),

        /** Add Friend Request **/
        addFriendRequest: builder.mutation<boolean, { request: AddFriend.Request, loggedInUser: UserOverview }>({
            query: (query) => {
                const { request } = query
                console.log('approve friend', { request });
                return {
                    url: `/pending/${request.username}`,
                    method: 'POST',
                }
            },

            transformResponse: (response: AddFriend.Response) => (response.data.added),
            invalidatesTags: (result, error, request) => {
                const { loggedInUser } = request;
                return (result ? [{ type: FriendApiTags.PENDING }, { type: FriendApiTags.LIST, id: loggedInUser.username }] : [])
            }
        }),

        /** Approve Friend Request **/
        approveFriendRequest: builder.mutation<boolean, { request: AddFriend.Request, loggedInUser: UserOverview }>({
            query: (query) => {
                const { request } = query
                console.log('approve friend', { request });
                return {
                    url: `/pending/${request.username}`,
                    method: 'PUT',
                }
            },

            transformResponse: (response: AddFriend.Response) => (response.data.added),
            invalidatesTags: (result, error, request) => {
                const { loggedInUser } = request;
                return (result ? [{ type: FriendApiTags.PENDING }, { type: FriendApiTags.LIST, id: loggedInUser.username }] : [])
            }
        }),

        /** Reject Friend Request **/
        rejectFriendRequest: builder.mutation<boolean, { request: DeleteFriend.Request, loggedInUser: UserOverview }>({
            query: (query) => {
                const { request } = query;
                console.log('reject friend request', { request });
                return {
                    url: `/pending/${request.username}`,
                    method: 'DELETE',
                }
            },
            transformResponse: (response: DeleteFriend.Response) => (response.data.deleted),
            invalidatesTags: (result, error, request) => (result ? [{ type: FriendApiTags.PENDING }] : [])
        }),

        /** Remove Friend **/
        removeFriend: builder.mutation<boolean, { request: DeleteFriend.Request, loggedInUser: UserOverview }>({
            query: (query) => {
                const { request } = query;
                console.log('remove friend', { request });
                return {
                    url: `/${request.username}`,
                    method: 'DELETE',
                }
            },
            transformResponse: (response: DeleteFriend.Response) => (response.data.deleted),
            invalidatesTags: (result, error, request) => {
                const { loggedInUser } = request;
                return (result ? [{ type: FriendApiTags.LIST, id: loggedInUser.username }] : [])
            }
        }),
    }),

});
