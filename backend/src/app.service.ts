import { Injectable } from '@nestjs/common';
import { TumblrService } from './providers/tumblr/tumblr.service';
import moment = require('moment');

@Injectable()
export class AppService {
    constructor(private readonly tumblrService: TumblrService) {}

    public async crawlTumblrPosts(identifier: string): Promise<void> {
        /* 
        const currentPosts = [];
        const logEveryIteration = 3;
        let logIteration = 0;
        let isFetchFinished = false;
        let pageNumber = 1;
        let limit = 10;
        let before =  moment().unix();

        while (true) {
            let offset = limit * (pageNumber - 1);
            offset = offset == 0 ? 0 : offset + 1;

            const options = {identifier, offset, limit}
            const { total, posts } = await this.tumblrService.getBlogPostsByOffset(options);
            console.log(`Got ${posts.length} of ${total} posts on page ${pageNumber}`);

            currentPosts.push(...posts);

            logIteration++;
            pageNumber++;

            if (logIteration == logEveryIteration) {
                console.log(`Current array in memory: ${JSON.stringify(currentPosts.map(p => p.id))}`);
                logIteration = 0;
            }

            if (posts.length === 0) {
                isFetchFinished = true;
            }

            await AppService.sleep(2);

        }
        */
   }

    
    public static sleep = (seconds: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    };
}
