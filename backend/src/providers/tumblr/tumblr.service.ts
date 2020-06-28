import { Injectable } from '@nestjs/common';
import * as tumblr from 'tumblr.js';
import { Configuration } from '../../configuration';

// TODO: This should probably be instantiated with a factory.

@Injectable()
export class TumblrService {
    private client: tumblr.TumblrClient;
    private tumblrConfig = Configuration.getTumblrConfig();

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
}
