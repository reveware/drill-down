import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, Length, MinLength} from 'class-validator';

export class LoginAttemptDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(9)
    password!: string;
}
