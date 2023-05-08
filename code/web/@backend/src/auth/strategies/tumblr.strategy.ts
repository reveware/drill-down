import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
//@ts-ignore
import { Strategy } from 'passport-tumblr';
import { Configuration } from '../../configuration';
import express from 'express';

/* backend/node_modules/passport-oauth/lib/passport-oauth/strategies/oauth.js **/
const tumblrConfig = Configuration.getTumblrConfig();
@Injectable()
export class TumblrStrategy extends PassportStrategy(Strategy, 'tumblr') {
    constructor() {
        super({
            consumerKey: tumblrConfig.consumer_key,
            consumerSecret: tumblrConfig.consumer_secret,
            callbackURL: tumblrConfig.callback_url,
            userAuthorizationURL: 'https://www.tumblr.com/oauth/authorize',
            requestTokenURL: 'https://www.tumblr.com/oauth/request_token',
            accessTokenURL: 'https://www.tumblr.com/oauth/access_token',
            passReqToCallback: true,
            includeEmail: true,
        });
    }

    validate(req: express.Request, accessToken: string, refreshToken: string, profile: any, done: (err: Error | null, user: any) => void) {
        const fullUser = { uniqueKey: 'drill-down', ...profile };
        done(null, fullUser);
    }
}
