import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsPositive, IsOptional } from 'class-validator';
import {CreateComment} from '@drill-down/interfaces';

export class CreateCommentDTO implements CreateComment.Request {
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
