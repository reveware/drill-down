import {User} from './User.interface';


export interface AuthResponse {
  isAuthorized: boolean;
  message: string;
  token: string;
}


export interface JwtPayload {
  user: Partial<User>
}
