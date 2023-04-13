import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, Length, IsDateString, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { UserRole } from "../shared/interfaces";

export class CreateUserDTO {
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
