import { UserRole } from "../interfaces";

export interface CreateUser {
    avatar: File,
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    tagLine: string | undefined;
    role: UserRole;
}
