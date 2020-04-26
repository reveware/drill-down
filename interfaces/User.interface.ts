export interface User  {
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
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}
