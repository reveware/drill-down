import { MaybePopulated, Post, Provider } from ".";

export interface User {
  id: MaybePopulated<undefined, string>;
  username: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  tagLine: string;
  role: UserRole;
  friends: Array<MaybePopulated<string, User>>;
  likes: string[];
  posts: Array<Post>
  providers: Array<Provider>;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}


