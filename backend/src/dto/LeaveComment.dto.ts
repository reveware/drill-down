import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LeaveCommentDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((object, value) => value !== null)
    replyTo: string | null;
}
