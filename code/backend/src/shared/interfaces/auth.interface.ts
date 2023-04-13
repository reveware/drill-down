import { UserWithoutPassword } from "./user.interface";

export interface JwtPayload {
    user: UserWithoutPassword
    iat: number;
    exp: number;
  }

  export interface AuthResponse {
    is_authorized: boolean;
    message: string;
    token: string | null;
  }
