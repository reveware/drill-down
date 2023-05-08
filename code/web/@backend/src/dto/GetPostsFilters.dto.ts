import { GetPosts } from '@drill-down/interfaces';
import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';

export class GetPostsFiltersDTO implements GetPosts.Request {
    @IsPositive()
    @IsInt()
    @IsOptional()
    id? : number;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    page_number!: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    page_size!: number;
}
