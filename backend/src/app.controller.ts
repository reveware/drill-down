import {Controller, Get, Logger} from '@nestjs/common';
import {TumblrService} from './providers/tumblr/tumblr.service';

const logger = new Logger('AppController');

@Controller()
export class AppController {
    constructor(private tumblrService: TumblrService) {}

    @Get()
   async hello(): Promise<any> {
        try {
            return await this.tumblrService.getUserInfo();
        } catch (e) {
            logger.error('ERROR getting user info ' + e.message)
        }
    }
}
