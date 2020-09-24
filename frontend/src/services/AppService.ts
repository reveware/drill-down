import axios, { AxiosError } from 'axios';
import { Configuration } from '../configuration';
import {CustomError, AuthResponse, User, Post} from "@drill-down/interfaces";
import {StorageKeys} from "../types";

export class AppService {
    private url = Configuration.SERVER_URL;

    public async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data } = await axios.post(`${this.url}/auth`, { email, password });
            return data as AuthResponse;
        } catch (e) {
            throw this.makeError('login', e);
        }
    }

    public async createUser(user: FormData): Promise<User> {
        try {
            const { data } = await axios.post(`${this.url}/users`, user);
            return data as User;
        } catch (e) {
            throw this.makeError('createUser', e);
        }
    }

    public async getUserPosts(username: string): Promise<Post[]>{
        try {
            const headers = this.getHeaders();
            const {data} = await axios.get(`${this.url}/posts/${username}`, {headers});
            return data as Post[];
        } catch (e) {
            throw this.makeError('getUserPosts', e);
        }
    }

    private getHeaders() {
        const token = sessionStorage.getItem(StorageKeys.AUTH_TOKEN)
        return {
            Authorization : `Bearer ${token}`
        }
    }

    private makeError(name: string, e: AxiosError): CustomError {
        const { response } = e;
        return { name, ...response?.data } as CustomError;
    }
}
