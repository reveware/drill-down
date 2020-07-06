import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsIn, IsNotEmpty, IsString, Length, IsNumberString} from 'class-validator';
import * as _ from 'lodash';
import {UserRole} from '../../../interfaces';

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(9, 20)
    password: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    dateOfBirth: number;

    @ApiProperty()
    @IsString()
    tagLine: string;

    @ApiProperty()
    @IsString()
    @IsIn(_.values(UserRole))
    role: UserRole;
}
