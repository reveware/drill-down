import { UserOverview } from "./user";

export interface JwtPayload {
    user: UserOverview
    iat: number;
    exp: number;
  }

  export interface AuthResponse {
    is_authorized: boolean;
    message: string;
    token: string | null;
  }
