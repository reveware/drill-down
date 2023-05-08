import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { Configuration } from 'src/configuration';
import { StorageKeys } from '../store/store.types';

export const customFetchBaseQuery = (path: string): BaseQueryFn => async (args, api, extraOptions) => {
    const baseUrl = `${Configuration.SERVER_URL}/${path}`;

    const result = await fetchBaseQuery({
        ...extraOptions,
        baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    })(args, api, extraOptions);

    if (result.error) {
        const customError = result.error.data;
        return {
            ...result,
            error: customError,
        };
    }

    return result
};
