import { IsString, IsOptional, IsInt, IsPositive, IsIn } from 'class-validator';

export class GetPostsFiltersDTO {

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
    page_number: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    page_size: number;
}
