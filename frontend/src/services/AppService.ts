import axios, { AxiosError } from 'axios';
import { Configuration } from '../configuration';
import { CustomError, AuthResponse, User, Post, CountByTag, JwtPayload, PostTypes, PhotoPost } from '@drill-down/interfaces';
import { StorageKeys } from '../types';
import * as _ from 'lodash';
import moment from 'moment';
import JwtDecode from 'jwt-decode';

export class AppService {
    private url = Configuration.SERVER_URL;

    public isAuthValid(token: string | null): boolean {
        if (token) {
            const { exp }: JwtPayload = JwtDecode(token);
            const now = moment();
            const expires = moment.unix(exp);
            if (expires.isAfter(now)) {
                return true;
            }
        }

        return false;
    }

    public async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data } = await axios.post(`${this.url}/auth`, { email, password });
            return data as AuthResponse;
        } catch (e) {
            throw AppService.makeError('login', e);
        }
    }

    public async createUser(user: FormData): Promise<User> {
        try {
            const { data } = await axios.post(`${this.url}/users`, user);
            return data as User;
        } catch (e) {
            throw AppService.makeError('createUser', e);
        }
    }

    public async getUserPosts(username: string): Promise<Post[]> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.get(`${this.url}/posts/${username}`, { headers });
            return data as Post[];
        } catch (e) {
            throw AppService.makeError('getUserPosts', e);
        }
    }

    public async getPostsForTag(tag: string) {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.get(`${this.url}/posts`, { headers, params: { tags: tag } });
            return data as Post[];
        } catch (e) {
            throw AppService.makeError('getPostsForTag', e);
        }
    }

    public async getPostsCountByTag(username: string): Promise<CountByTag[]> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.get(`${this.url}/tags/${username}/count`, { headers });
            return data as CountByTag[];
        } catch (e) {
            throw AppService.makeError('getPostsCountByTag', e);
        }
    }

    public async createPhotoPost(post: { photos: File[]; tags: string[]; description: string }): Promise<any> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.post(`${this.url}/posts/photo`, post, { headers });
            return data as Post;
        } catch (e) {
            throw AppService.makeError('createPost', e);
        }
    }

    private static getHeaders() {
        const token = sessionStorage.getItem(StorageKeys.AUTH_TOKEN);
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }

    private static makeError(name: string, e: AxiosError): CustomError {
        const { response } = e;
        return { name, ...response?.data } as CustomError;
    }
}
