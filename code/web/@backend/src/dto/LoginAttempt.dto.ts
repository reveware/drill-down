import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import { LoginAttempt } from '@drill-down/interfaces';

export class LoginAttemptDTO implements LoginAttempt.Request{
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
