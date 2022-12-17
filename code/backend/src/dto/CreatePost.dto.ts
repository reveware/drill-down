import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';

export class CreatePhotoPostDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    tags!: string; // comma separated

    @ApiProperty()
    @IsOptional()
    description?: string;
}
