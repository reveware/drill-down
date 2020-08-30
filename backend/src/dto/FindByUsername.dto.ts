import { IsString, IsNotEmpty } from 'class-validator';

export class FindByUsernameDTO {
    @IsNotEmpty()
    @IsString()
    username: string;
}
