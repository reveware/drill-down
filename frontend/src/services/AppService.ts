import axios, { AxiosError } from 'axios';
import { Configuration } from '../configuration';
import { CustomError, AuthResponse, User, Post, CountByTag, JwtPayload, Populated, CreateUser, Comment} from '@drill-down/interfaces';

import * as _ from 'lodash';
import moment from 'moment';
import JwtDecode from 'jwt-decode';
import { StorageKeys } from '../store/storage.types';

export class AppService {
    private url = Configuration.SERVER_URL;

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

    public async login(loginAttempt: { email: string; password: string }): Promise<AuthResponse> {
        const { data } = await axios.post(`${this.url}/auth`, loginAttempt);
        return data as AuthResponse;
    }

    public async createUser(user: CreateUser): Promise<Populated<User>> {
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

    public async fetchUserByUsername(username: string): Promise<Populated<User>> {
        const headers = AppService.getHeaders();
        const { data } = await axios.get(`${this.url}/users/${username}`, { headers });
        return data.user;
    }

    public async getUserPosts(username: string): Promise<Populated<Post>[]> {
        const headers = AppService.getHeaders();
        const { data } = await axios.get(`${this.url}/posts/${username}`, { headers });
        return data;
    }

    public async getPostsForTag(tag: string): Promise<Populated<Post>[]> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.get(`${this.url}/posts`, { headers, params: { tags: tag } });
            return data;
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

    public async createPhotoPost(post: { photos: File[]; tags: string[]; description: string }): Promise<Populated<Post>> {
        const headers = AppService.getHeaders();
        // manually build multi-part form
        const formData = new FormData();
        post.photos.forEach((file: File) => {
            formData.append('photos', file, file.name);
        });
        formData.append('description', post.description);
        formData.append('tags', post.tags.join(','));
        const { data } = await axios.post(`${this.url}/posts/photo`, formData, { headers });
        return data;
    }

    public async createComment(comment: { message: string; replyTo: string | null; postId: string }): Promise<Populated<Comment>> {
        try {
            const headers = AppService.getHeaders();
            const { data } = await axios.put(`${this.url}/posts/comment/${comment.postId}`, comment, { headers });
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
