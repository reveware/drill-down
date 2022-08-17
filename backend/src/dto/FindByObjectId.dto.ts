import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class FindByObjectId {
    @IsNotEmpty()
    @IsString()
    @Matches(new RegExp(/^[0-9a-fA-F]{24}$/), { message: 'id is not a valid ObjectId' })
    id: string;
}
