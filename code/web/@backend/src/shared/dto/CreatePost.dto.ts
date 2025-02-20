import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { CreatePhotoPost, CreateQuotePost } from '@drill-down/interfaces';

class BasePost {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    tags!: string[];

    @ApiProperty()
    @IsOptional()
    description?: string;
}
export class CreatePhotoPostDTO extends BasePost implements CreatePhotoPost.Request {
    @ApiProperty()
    photos!: File[];
}

export class CreateQuotePostDTO extends BasePost implements CreateQuotePost.Request {
    @ApiProperty()
    @IsString()
    quote!: string;

    @ApiProperty()
    @IsString()
    author!: string;
}
