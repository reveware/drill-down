import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, Length, IsDateString } from 'class-validator';
import * as _ from 'lodash';
import { UserRole } from "@drill-down/interfaces";

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;
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
    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty()
    @IsString()
    tagLine: string;

    @ApiProperty()
    @IsString()
    @IsIn(_.values(UserRole))
    role: UserRole;
}
