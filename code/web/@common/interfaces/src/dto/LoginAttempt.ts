import { AuthResponse } from "../types/auth";

export namespace LoginAttempt {
  export interface Request {
    email: string;
    password: string;
  }

  export interface Response {
    data: AuthResponse;
  }
}
