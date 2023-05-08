import { createApi } from '@reduxjs/toolkit/query/react';
import { AuthResponse, LoginAttempt } from '@drill-down/interfaces';
import { customFetchBaseQuery } from './customFetchBaseQuery';

export const AuthApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customFetchBaseQuery('auth'),
    endpoints: (builder) => ({
        /** Login **/
        loginAttempt: builder.mutation<AuthResponse, LoginAttempt.Request>({
            query: (request) => {
                return {
                    url: `/`,
                    method: 'POST',
                    body: request,
                };
            },
            transformResponse: (response: LoginAttempt.Response) => response.data,
        }),

        /** Refresh Toke */
        // TODO: Implement refresh_token
    }),
});
