import { Injectable, Logger } from '@nestjs/common';
import * as tumblr from 'tumblr.js';
import { Configuration } from '../../configuration';
import { Post } from '../../../../interfaces/Post.interface';
import * as moment from 'moment';

// TODO: This should probably be instantiated with a factory.

@Injectable()
export class TumblrService {
    private logger = new Logger('TumblrService');
    private tumblrConfig = Configuration.getTumblrConfig();
    private client: tumblr.TumblrClient;

    constructor() {
        this.client = tumblr.createClient(this.tumblrConfig);
    }

    public async getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.userInfo((err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    public async getBlogPostsByOffset(options: {
        identifier: string;
        offset?: number;
        limit?: number;
        before?: number;
        tag?: string;
    }): Promise<{ total: number; posts: Post[] }> {
        this.logger.log(`Getting posts with: options : ${JSON.stringify(options)}`);
        const { identifier } = options;
        return new Promise((resolve, reject) => {
            this.client.blogPosts(identifier, options, (err, data) => {
                if (err) {
                    this.logger.error(`ERROR getting Tumblr posts by offset with options_ ${options}`);
                    return reject(err);
                }

                const customPosts = [];
                const { total_posts, posts } = data;
                console.log(`looping ${posts.length} posts`);

                for (const post of posts) {
                    const { type, id, post_url, slug, timestamp, photos, tags, image_permalink } = post;
                    let photoUrls = [];

                    //  type: text, photo, quote, link, video
                    if (type == 'photo' && photos.length > 0) {
                        photoUrls = photos.map((photo) => {
                            if (photo.original_size && photo.original_size.url) {
                                return photo.original_size.url;
                            }
                        });
                    }

                    customPosts.push({ id, type, tags, url: post_url, createdAt: timestamp, photos: photoUrls, slug, image_permalink });
                }

                if (total_posts !== customPosts.length) {
                    reject(
                        new Error(
                            `Different length mapping tumblr posts: total_posts ${total_posts} customPosts.length ${customPosts.length}`
                        )
                    );
                }

                resolve({ total: customPosts.length, posts: customPosts });
            });
        });
    }
}
