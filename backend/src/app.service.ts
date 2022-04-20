import { Injectable, Logger } from '@nestjs/common';
import { TumblrService } from './providers/tumblr/tumblr.service';
import moment = require('moment');
import { PostService } from './post/post.service';
import * as _ from 'lodash';
import { Post, User } from "@drill-down/interfaces";
import { UserDocument } from './user/user.schema';

@Injectable()
export class AppService {
    private logger = new Logger('AppService');
    constructor(private readonly tumblrService: TumblrService, private readonly postService: PostService) {}

    public async crawlTumblrPosts(user: User): Promise<void> {
        let before = moment().unix();
        try {
            let currentPosts: Post[] = [];
            const saveEveryIteration = 10;
            let iteration = 0;
            let pageNumber = 1;
            const limit = 10;

            while (true) {
                let offset = limit * (pageNumber - 1);
                offset = offset == 0 ? 0 : offset + 1;

                const options = { identifier: 'rrriki', offset, limit, type: 'photo', before };
                const { total, posts } = await this.tumblrService.getBlogPostsByOffset(options);
                console.log(`Got ${posts.length} of ${total} posts on page ${pageNumber}`);

                currentPosts.push(...posts);

                iteration++;
                pageNumber++;

                if (posts.length === 0 || iteration === saveEveryIteration) {
                    console.log(`finished crawling, saving ${currentPosts.length} posts to mongo`);

                    for (const customPost of currentPosts) {
                        await this.postService.createPost({ ...customPost, author: (user as UserDocument).id });
                    }

                    before = _.last(currentPosts).createdAt;
                    currentPosts = [];
                    break;
                }

                await AppService.sleep(3);
            }
        } catch (e) {
            this.logger.error('Error crawling posts', e.message);
        } finally {
            this.logger.log('crawled tumblr posts, latest before: ' + before);
        }
    }

    public static sleep = (seconds: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    };
}
