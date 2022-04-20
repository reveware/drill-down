import { Injectable, Logger } from '@nestjs/common';
import * as tumblr from 'tumblr.js';
import { Configuration } from '../../configuration';
import { Providers, Post, PostTypes } from "@drill-down/interfaces";

export interface OffsetParams {
    identifier: string;
    type?: string;
    offset?: number;
    limit?: number;
    before?: number;
    tag?: string;
}

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
            this.client.userInfo((e, data) => {
                if (e) {
                    return reject(e);
                }
                resolve(data);
            });
        });
    }

    public async getBlogPostsByOffset(options: OffsetParams): Promise<{ total: number; posts: Post[] }> {
        this.logger.log(`Getting posts with: options : ${JSON.stringify(options)}`);
        const { identifier } = options;
        return new Promise((resolve, reject) => {
            this.client.blogPosts(identifier, options, (e, data) => {
                if (e) {
                    this.logger.error(`ERROR getBlogPostsByOffset, options: ${options} - ${e.mesage}`);
                    return reject(e);
                }

                const customPosts: Post[] = [];
                const { posts } = data;

                console.log(`looping ${posts.length} posts`);

                for (const post of posts) {
                    //  type: text, photo, quote, link, video
                    if (post.type == 'photo') {
                        customPosts.push(this.mapToCustomPost(post));
                    } else {
                      //  console.log('ignoring post:', JSON.stringify(post));
                    }
                }

                resolve({ posts: customPosts, total: customPosts.length });
            });
        });
    }

    private mapToCustomPost(tumblrPost): Post {
        const { id, type, tags, timestamp } = tumblrPost;
        console.log('tumblrPost', JSON.stringify(tumblrPost));
        if (type === 'photo') {
            const { photos } = tumblrPost;
            const customPost: Partial<Post> = {
                provider: Providers.TUMBLR,
                providerId: id,
                type: PostTypes.PHOTO,
                author: tumblrPost.blog_name,
                body: {
                    urls: photos.map((photo) => {
                        if (photo && photo.original_size && photo.original_size.url) {
                            return photo.original_size.url;
                        }
                    }),
                },
                tags,
                stars: [],
                comments: [],
                createdAt: timestamp,
            };

            return customPost as Post;
        } else {
            throw new Error(`Only mapping photo posts for now. ${type} was given`);
        }
    }
}
