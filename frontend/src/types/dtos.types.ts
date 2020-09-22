export interface CreateUserDTO {
    avatar: File | null ;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tagLine: string;
    dateOfBirth: Date | null;
    role: string;
}
