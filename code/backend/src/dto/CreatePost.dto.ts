import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { CreatePhotoPost } from '@drill-down/interfaces';
export class CreatePhotoPostDTO implements CreatePhotoPost.Request {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    tags!: string[];

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    photos!: any[];
}
