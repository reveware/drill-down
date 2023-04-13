import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsPositive, IsOptional } from 'class-validator';
import { isInteger } from 'lodash';

export class CreateCommentDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message!: string;

    @ApiProperty()
    @IsPositive()
    @IsInt()
    @IsOptional()
    reply_to?: number;
}
