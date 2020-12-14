import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import * as _ from 'lodash';


export class CreatePhotoPostDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    tags: string; // comma separated

    @ApiProperty()
    @IsString()
    description: string;
}
