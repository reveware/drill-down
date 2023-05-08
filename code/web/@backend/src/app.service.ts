import { Injectable, Logger } from '@nestjs/common';
import { TumblrService } from './providers/tumblr/tumblr.service';
import * as moment from 'moment';
import { Utils } from '@drill-down/constants';
import { PostService } from './post/post.service';
import * as _ from 'lodash';
import {  TumblrPhotoPost, TumblrPost} from './shared/interfaces';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
    private logger = new Logger('AppService');
    constructor(private readonly tumblrService: TumblrService, private readonly postService: PostService) {}

    public async crawlTumblrPosts(user: User, maxPages?: number): Promise<void> {
        try {
            const identifier = 'rrriki';
            let pageNumber = 1;
            const pageSize = 25;

            const saveInterval = 3;
            let currentPosts: TumblrPost[] = [];

            while (true) {
                const offset = pageSize * (pageNumber - 1);
                const options = { identifier, offset, limit: pageSize };

                console.log('calling tumblr with', {...options})
                const { posts } = await this.tumblrService.getBlogPostsByOffset(options);
                
                const isPageEmpty = posts.length === 0;
                const reachedMaxPages = maxPages && pageNumber === maxPages;
                const shouldSave = pageNumber % saveInterval === 0;

                currentPosts.push(...posts);

                if (isPageEmpty) {
                    break;
                }

                if (isPageEmpty || reachedMaxPages || shouldSave) {
                    await this.savePhotoPosts(currentPosts, user);
                    // TODO: add confg table and store new latest timestamp
                    // before = _.last(currentPosts)!.timestamp;

                    currentPosts = [];
                }

                if (reachedMaxPages || isPageEmpty) {
                    break;
                }

                pageNumber++;

                await Utils.sleep(1);
            }
        } catch (e) {
            this.logger.error('Error crawling posts', e.message);
        } finally {
            this.logger.log('Finished crawling tumblr posts');
        }
    }

    private async savePhotoPosts(posts: TumblrPost[], user: User) {
        const photoPosts = posts.filter((post): post is TumblrPhotoPost => post.type === 'photo');

        console.log(`saving ${photoPosts.length} photo posts from ${posts.length} total posts`);

        for (const photoPost of photoPosts) {
            const urls = photoPost.photos.map((photo) => photo.original_size.url);
            await this.postService.createPhotoPost(
                user,
                {   photos: [],
                    description: photoPost.summary,
                    tags: photoPost.tags,
                },
                urls
                
            );
        }
    }

}
