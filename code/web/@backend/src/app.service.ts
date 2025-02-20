import { Injectable, Logger } from '@nestjs/common';
import { TumblrService } from './providers/tumblr/tumblr.service';
import * as moment from 'moment';
import { Utils } from '@drill-down/constants';
import { PostService } from './post/post.service';
import * as _ from 'lodash';
import { TumblrPhotoPost, TumblrPost, TumblrQuotePost, TumblrTextPost } from './shared/interfaces';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
    private logger = new Logger('AppService');
    constructor(private readonly tumblrService: TumblrService, private readonly postService: PostService) {}

    public async crawlTumblr(user: User, maxPages?: number): Promise<void> {
        try {
            const identifier = 'rrriki';
            const types = ['photo', 'quote'];

            for (const type of types) {
                await this.findAndSaveBlogPosts(user, identifier, type, maxPages);
            }
        } catch (e) {
            this.logger.error('Error crawling posts', e.message);
        } finally {
            this.logger.log('Finished crawling tumblr posts');
        }
    }

    // TODO: Move to user.service (https://trello.com/c/SqQLiajM)
    private async findAndSaveBlogPosts(user: User, blog: string, type: string, maxPages?: number) {
        let pageNumber = 1;
        const pageSize = 25;
        const saveInterval = 3;
        let currentPosts: TumblrPost[] = [];

        while (true) {
            const offset = pageSize * (pageNumber - 1);
            const options = { identifier: blog, offset, limit: pageSize, type };

            const { posts } = await this.tumblrService.getBlogPostsByOffset(options);

            const isPageEmpty = posts.length === 0;
            const reachedMaxPages = maxPages && pageNumber === maxPages;
            const shouldSave = pageNumber % saveInterval === 0;

            currentPosts.push(...posts);

            if (isPageEmpty) {
                break;
            }

            if (isPageEmpty || reachedMaxPages || shouldSave) {
                for (const post of currentPosts) {
                    if (this.tumblrService.isPhotoPost(post)) {
                        await this.savePhotoPosts(post as TumblrPhotoPost, user);
                        continue;
                    }
                    if (this.tumblrService.isQuotePosts(post)) {
                        await this.saveQuotePosts(post as TumblrQuotePost, user);
                    }
                }

                // TODO: add confg table and store new latest timestamp (https://trello.com/c/SqQLiajM)
                // before = _.last(currentPosts)!.timestamp;

                currentPosts = [];
            }

            if (reachedMaxPages || isPageEmpty) {
                break;
            }

            pageNumber++;

            await Utils.sleep(1);
        }
    }

    private async saveQuotePosts(quotePost: TumblrQuotePost, user: User) {
        const removeHTMLTags = (text: string) => text.replace(/<[^>]+>/g, '');
        const removeViaSourceMessage = (text: string) => text.replace(/\(via .+\)$/, '');

        await this.postService.createQuotePost(user, {
            author: removeViaSourceMessage(removeHTMLTags(quotePost.source)),
            quote: removeHTMLTags(quotePost.text),
            tags: quotePost.tags,
            description: removeHTMLTags(quotePost.summary),
        });
    }

    private async savePhotoPosts(photoPost: TumblrPhotoPost, user: User) {
        const urls = photoPost.photos.map((photo) => photo.original_size.url);
        await this.postService.createPhotoPost(user, { photos: [], description: photoPost.summary, tags: photoPost.tags }, urls);
    }
}
