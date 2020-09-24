export interface User  {
    username:string,
    avatar: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    age: number,
    dateOfBirth: number,
    tagLine?: string,
    role: UserRole,
    friends: string[],
    isOnParty: boolean,
    providers: string[],
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}
