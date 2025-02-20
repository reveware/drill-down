import { GetPosts } from '@drill-down/interfaces';
import { IsOptional, IsInt, IsPositive } from 'class-validator';

export class PaginateDTO implements GetPosts.Request {
    @IsInt()
    @IsPositive()
    @IsOptional()
    page_number!: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    page_size!: number;
}
