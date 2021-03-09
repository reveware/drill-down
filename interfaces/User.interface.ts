export interface User {
  username: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  tagLine?: string;
  role: UserRole;
  friends: string[] | User[];
  providers: string[];
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
