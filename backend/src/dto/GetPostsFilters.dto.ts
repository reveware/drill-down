import { IsString, IsOptional } from 'class-validator';

export class GetPostsFiltersDTO {
    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsString()
    provider?: string;
}
