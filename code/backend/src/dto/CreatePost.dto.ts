import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';

export class CreatePhotoPostDTO {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    tags!: string[];

    @ApiProperty()
    @IsOptional()
    description?: string;
}
