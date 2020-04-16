import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Length} from 'class-validator';
import * as _ from 'lodash';
import {UserRole} from '../../../types';

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
    @Length(8, 20)
    password: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    dateOfBirth: number;

    @ApiProperty()
    @IsString()
    tagLine: string;

    @ApiProperty()
    @IsString()
    @IsIn(_.values(UserRole))
    role: string;
}
