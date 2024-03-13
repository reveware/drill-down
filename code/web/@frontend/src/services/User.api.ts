import { createApi } from '@reduxjs/toolkit/query/react';
import { CreateUser, GetUser, UserDetail, UserOverview } from '@drill-down/interfaces';
import { customFetchBaseQuery } from './customFetchBaseQuery';

export enum UserApiTags {
    OVERVIEW = 'UserOverview',
    DETAIL = 'UserDetail',
}

export const UsersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: customFetchBaseQuery('users'),
    tagTypes: [UserApiTags.OVERVIEW, UserApiTags.DETAIL],
    endpoints: (builder) => ({
        /** Create User **/
        createUser: builder.mutation<UserOverview, CreateUser.Request>({
            query: (request) => {
                const formData = new FormData();
                formData.append('username', request.username);
                formData.append('email', request.email);
                formData.append('password', request.password);
                formData.append('first_name', request.first_name);
                formData.append('last_name', request.last_name);
                formData.append('date_of_birth', request.date_of_birth);
                formData.append('role', request.role);
                request.tagline && formData.append('tagline', request.tagline);
                // last because https://stackoverflow.com/questions/39589022/node-js-multer-and-req-body-empty
                formData.append('avatar', request.avatar, request.avatar.name);

                return {
                    url: '/',
                    method: 'POST',
                    body: formData,
                };
            },
            transformResponse: (response: CreateUser.Response) => response.data,
        }),

        /** Get User Detail **/
        getUserDetail: builder.query<UserDetail, GetUser.Request>({
            query: (request) => {
                console.log('getting user profile', {request})
                const { username } = request;
                return {
                    url: `/${username}`,
                    method: 'GET',
                };
            },
            transformResponse: (response: GetUser.Response) => response.data,
            providesTags: (result) => (result ? [{ type: UserApiTags.DETAIL, id: result.id }] : []),
        }),
    }),
});
