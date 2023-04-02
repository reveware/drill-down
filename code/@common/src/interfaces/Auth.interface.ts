import { Populated, User } from ".";

export interface AuthResponse {
  isAuthorized: boolean;
  message: string;
  token: string | null;
}

export interface JwtPayload {
  user: Populated<User>;
  iat: number;
  exp: number;
}
