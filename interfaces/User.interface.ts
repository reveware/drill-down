import { MaybePopulated, Populated} from "./types";

export interface User {
  id: MaybePopulated<undefined, string>;
  username: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  tagLine?: string;
  role: UserRole;
  friends: Array<Friend>;
  starredPosts: string[]
  providers: string[];
}

export type Friend = MaybePopulated<string, User>

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
