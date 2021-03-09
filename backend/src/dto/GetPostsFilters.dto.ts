import { Providers } from '@drill-down/interfaces';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class GetPostsFiltersDTO {

    @IsOptional()
    @IsString()
    _id? : string;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsEnum(Providers)
    provider?: Providers;
}
