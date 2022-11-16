import { Blender, User } from '@drill-down/interfaces';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssetsService {
    private logger = new Logger('AssetsService');

    public async findOrSchedule(user: User, tags: string[]): Promise<Blender.Asset[]> {
        /* TODO: 
            This should search an S3 bucket for assets by asset_id or asset_name based on the given tags
            There should be an association of tags to produced assets
            If there are no assets for any of the tags, it should append to a queue of "assets to make"
         */

        return []
    }
}