export interface CreateUserDTO {
    avatar: File | null;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tagLine: string;
    dateOfBirth: Date;
    role: string;
}
