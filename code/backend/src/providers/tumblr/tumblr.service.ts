import { TumblrOffsetParams, TumblrPost } from '../../shared/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import * as tumblr from 'tumblr.js';
import { Configuration } from '../../configuration';

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

    public async getBlogPostsByOffset(options: TumblrOffsetParams): Promise<{ total: number; posts: TumblrPost[] }> {
        this.logger.log(`Getting posts with: options : ${JSON.stringify(options)}`);
        const { identifier } = options;
        return new Promise((resolve, reject) => {
            this.client.blogPosts(identifier, options, (e, data) => {
                if (e) {
                    this.logger.error(`Error getBlogPostsByOffset, options: ${options} - ${e.mesage}`);
                    return reject(e);
                }
                const { posts } = data;
               
                resolve({ posts, total: posts.length });
            });
        });
    }
}
