import { GetPosts } from '@drill-down/interfaces';
import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { PaginateDTO } from './Paginate.dto';

export class GetPostsFiltersDTO extends PaginateDTO implements GetPosts.Request {
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
}
