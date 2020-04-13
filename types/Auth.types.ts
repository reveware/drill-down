import {User} from './User.types';

export interface JwtPayload {
  user: Partial<User>
}
