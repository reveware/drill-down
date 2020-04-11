import {Controller, Get, Logger} from '@nestjs/common';
import {TumblrService} from './providers/tumblr/tumblr.service';

const logger = new Logger('AppController');

@Controller()
export class AppController {
    constructor(private readonly tumblrService: TumblrService) {}

    @Get()
   async getUserInfo(): Promise<any> {
        try {
            return await this.tumblrService.getUserInfo();
        } catch (e) {
            logger.error('ERROR getting user info ' + e.message)
        }
    }
}
