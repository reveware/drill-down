import axios, { AxiosError } from 'axios';
import { Configuration } from '../configuration';
import { CustomError, AuthResponse, User, Post, CountByTag, JwtPayload, Populated, CreateUser, Comment } from '@drill-down/interfaces';

import * as _ from 'lodash';
import moment from 'moment';
import JwtDecode from 'jwt-decode';
import { StorageKeys } from '../store/storage.types';

export class AppService {
    private static url = Configuration.SERVER_URL;

    public static isAuthValid(token: string | null): boolean {
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

    public static async login(loginAttempt: { email: string; password: string }): Promise<AuthResponse> {
        const { data } = await axios.post(`${this.url}/auth`, loginAttempt);
        return data as AuthResponse;
    }

    public static async createUser(user: CreateUser): Promise<Populated<User>> {
        const headers = AppService.getHeaders();
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('dateOfBirth', user.dateOfBirth);
        formData.append('role', user.role);
        formData.append('tagLine', user.tagLine);
        // last because https://stackoverflow.com/questions/39589022/node-js-multer-and-req-body-empty
        formData.append('avatar', user.avatar, user.avatar.name);

        const { data } = await axios.post(`${this.url}/users`, formData, { headers });
        return data;
    }

    public static async fetchUserByUsername(username: string): Promise<Populated<User>> {
        const headers = AppService.getHeaders();
        const { data } = await axios.get(`${this.url}/users/${username}`, { headers });
        return data.user;
    }

    public static async getUserPosts(username: string): Promise<Populated<Post>[]> {
        const headers = AppService.getHeaders();
        const params = { author: username };
        const { data } = await axios.get(`${this.url}/posts/`, { headers, params });
        return data;
    }

    public static async getPostsForTag(tag: string): Promise<Populated<Post>[]> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.get(`${this.url}/posts`, { headers, params: { tags: tag } });
            return data;
        } catch (e) {
            throw AppService.makeError('getPostsForTag', e);
        }
    }

    public static async getPostsCountByTag(username: string): Promise<CountByTag[]> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.get(`${this.url}/users/${username}/tags/count`, { headers });
            return data as CountByTag[];
        } catch (e) {
            throw AppService.makeError('getPostsCountByTag', e);
        }
    }

    public static async createPhotoPost(post: { photos: File[]; tags: string[]; description: string }): Promise<Populated<Post>> {
        const headers = AppService.getHeaders();
        // manually build multi-part form
        const formData = new FormData();
        post.description && formData.append('description', post.description);
        post.photos.forEach((file: File) => {
            formData.append('photos', file, file.name);
        });
        
        formData.append('tags', post.tags.join(','));
        const { data } = await axios.post(`${this.url}/posts/photo`, formData, { headers });
        return data;
    }

    public static async deletePost(postId: string): Promise<void> {
        const headers = AppService.getHeaders();
        await axios.delete(`${this.url}/posts/${postId}`, { headers });
    }

    public static async createComment(comment: { message: string; replyTo: string | null; postId: string }): Promise<Populated<Comment>> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.put(`${this.url}/posts/${comment.postId}/comments`, comment, { headers });
            return data as Populated<Comment>;
        } catch (e) {
            throw AppService.makeError('createComment', e);
        }
    }

    private static getHeaders() {
        const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }

    public static makeError(name: string, e: AxiosError): CustomError {
        const { response } = e;
        return { name, ...response?.data } as CustomError;
    }
}
