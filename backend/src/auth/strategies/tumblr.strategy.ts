import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-tumblr';
import {Configuration} from '../../configuration';

const tumblrConfig = Configuration.getTumblrConfig();

@Injectable()
export class TumblrStrategy extends PassportStrategy(Strategy, 'tumblr') {
    constructor() {
        console.log('new tumblr strategy');
        super({
            consumerKey: tumblrConfig.consumer_key,
            consumerSecret: tumblrConfig.consumer_secret,
            callbackURL: 'http://localhost:8080/auth/tumblr/callback',
            passReqToCallback: true,
        }, () => {console.log('wtf')});
    }

    validate(req: any, accessToken: string, refreshToken: string, profile: any, done: (e: Error, user: any) => any) {
        console.log('validate');
    }

}
