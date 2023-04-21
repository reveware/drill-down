import { UserOverview, UserRole } from "..";

export namespace CreateUser {
  export interface Request {
    avatar: any;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: string;
    tagline: string;
    role: UserRole;
  }

  export interface Response {
    data: UserOverview;
  }
}
