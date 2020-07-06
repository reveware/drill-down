import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsObject, IsArray } from 'class-validator';
import * as _ from 'lodash';
import { PostTypes, PhotoPost, QuotePost } from '../../../interfaces';

export class CreatePostDTO {
    @ApiProperty()
    @IsString()
    @IsIn(_.values(PostTypes))
    type: PostTypes;

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    body: PhotoPost | QuotePost; // TODO: properly validate post body by type

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    tags: string[];

    @ApiProperty()
    @IsString()
    description: string;
}
