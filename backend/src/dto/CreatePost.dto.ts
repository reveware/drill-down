import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as _ from 'lodash';


export class CreatePhotoPostDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    tags: string; // comma separated

    @ApiProperty()
    @IsString()
    @MinLength(10)
    description: string;
}
