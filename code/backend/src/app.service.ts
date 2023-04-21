import { Injectable, Logger } from '@nestjs/common';
import { TumblrService } from './providers/tumblr/tumblr.service';
import * as moment from 'moment';
import { PostService } from './post/post.service';
import * as _ from 'lodash';
import {  TumblrPhotoPost, TumblrPost} from './shared/interfaces';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
    private logger = new Logger('AppService');
    constructor(private readonly tumblrService: TumblrService, private readonly postService: PostService) {}

    // TODO: Add config table and store last_saved
    // before = _.last(posts)!.timestamp;

    public async crawlTumblrPosts(user: User, maxPages?: number): Promise<void> {
        let before = moment().unix();
        try {
            const identifier = 'rrriki';
            let pageNumber = 1;
            const pageSize = 10;
            const saveInterval = 5;
            let currentPosts: TumblrPost[] = [];

            while (true) {
                const offset = pageSize * (pageNumber - 1);
                const options = { identifier, offset, limit: pageSize, before };

                const { posts } = await this.tumblrService.getBlogPostsByOffset(options);
                const isPageEmpty = posts.length === 0;

                const reachedMaxPages = maxPages && pageNumber === maxPages;
                currentPosts.push(...posts);

                if (isPageEmpty) {
                    break;
                }

                if (pageNumber % saveInterval === 0 || (maxPages && pageNumber === maxPages)) {
                    await this.savePhotoPosts(posts, user);
                    // TODO: add confg table and store new latest timestamp
                    // before = _.last(currentPosts)!.timestamp;

                    currentPosts = [];
                }

                if (reachedMaxPages) {
                    break;
                }

                pageNumber++;
                await AppService.sleep(1);
            }
        } catch (e) {
            this.logger.error('Error crawling posts', e.message);
        } finally {
            this.logger.log('Crawled tumblr posts, latest before: ' + before);
        }
    }

    private async savePhotoPosts(posts: TumblrPost[], user: User) {
        const photoPosts = posts.filter((post): post is TumblrPhotoPost => post.type === 'photo');

        console.log(`saving ${photoPosts.length} photo posts from ${posts.length} total posts`);

        for (const photoPost of photoPosts) {
            const urls = photoPost.photos.map((photo) => photo.original_size.url);
            await this.postService.createPhotoPost(
                user,
                {   photos: urls,
                    description: photoPost.summary,
                    tags: photoPost.tags,
                },
                
            );
        }
    }

    // TODO: move to @common/utils
    public static sleep = (seconds: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    };
}
