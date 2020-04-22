import axios, { AxiosError } from 'axios';
import { Configuration } from '../configuration';

interface LoginResponse {
    isAuthorized: boolean;
    message: string;
    token: string;
}
export class AppService {
    private url = Configuration.SERVER_URL;

    public async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const { data } = await axios.post(`${this.url}/auth`, { email, password });
            return data as LoginResponse;
        } catch (e) {
            throw this.makeError(e);
        }
    }

    private makeError(e: AxiosError) {
        console.log(e.response);
        throw new Error(e.response?.data.message);
    }
}
