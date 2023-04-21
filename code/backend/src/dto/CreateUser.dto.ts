import { ApiProperty } from '@nestjs/swagger';
import { CreateUser,UserRole } from '@drill-down/interfaces';
import { IsEmail, IsIn, IsNotEmpty, IsString, Length, IsDateString, IsOptional } from 'class-validator';
import * as _ from 'lodash';

export class CreateUserDTO implements CreateUser.Request {
    @ApiProperty() 
    avatar!: any;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    first_name!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(9, 20)
    password!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    date_of_birth!: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    tagline!: string;

    @ApiProperty()
    @IsString()
    @IsIn(_.values(UserRole))
    role!: UserRole;
}
