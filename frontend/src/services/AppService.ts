import axios, { AxiosError } from 'axios';
import { Configuration } from '../configuration';
import { CustomError, AuthResponse, User } from '../../../interfaces';

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

    private makeError(name: string, e: AxiosError) {
        const { response } = e;
        const error = { name, ...response?.data } as CustomError;
        throw error;
    }
}
