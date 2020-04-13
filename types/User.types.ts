import {Document} from 'mongoose';

export interface User extends Document  {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string,
    age: number,
    dateOfBirth: number,
    tagLine?: string,
    role: UserRole,
    posts: string[],
    friends: string[],
    isOnParty: boolean,
    providers: string[],
    isValidPassword: (password: string)=> boolean,
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}
