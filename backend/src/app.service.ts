import { Injectable, Logger } from '@nestjs/common';
import { TumblrService } from './providers/tumblr/tumblr.service';
import moment = require('moment');
import { PostService } from './post/post.service';
import * as _ from 'lodash';
import { Populated, Providers, TumblrPhotoPost, TumblrPost, User } from '@drill-down/interfaces';

@Injectable()
export class AppService {
    private logger = new Logger('AppService');
    constructor(private readonly tumblrService: TumblrService, private readonly postService: PostService) {}

    public async crawlTumblrPosts(user: Populated<User>): Promise<void> {
        let before = moment().unix();
        try {
            let currentPosts: TumblrPost[] = [];
            const iterationToSaveOn = 10;
            let iteration = 0;
            let pageNumber = 1;
            const limit = 10;

            while (true) {
                let offset = limit * (pageNumber - 1);
                offset = offset == 0 ? 0 : offset + 1;

                const options = { identifier: 'rrriki', offset, limit, before };
                const { total, posts } = await this.tumblrService.getBlogPostsByOffset(options);

                currentPosts.push(...posts);

                iteration++;
                pageNumber++;

                if (posts.length === 0 || iteration === iterationToSaveOn) {
                    const photoPosts = posts.filter((post): post is TumblrPhotoPost => post.type === 'photo');

                    for (const photoPost of photoPosts) {
                        const urls = photoPost.photos.map((photo) => photo.original_size.url);
                        await this.postService.createPhotoPost(
                            user,
                            {
                                description: photoPost.summary,
                                tags: photoPost.tags.join(','),
                            },
                            urls,
                            Providers.TUMBLR
                        );
                    }

                    before = _.last(currentPosts)?.timestamp;
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

    // TODO: move to @common/utils
    public static sleep = (seconds: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    };
}
