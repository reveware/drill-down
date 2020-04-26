import {Controller, Get, Logger} from '@nestjs/common';
import {TumblrService} from './providers/tumblr/tumblr.service';

@Controller()
export class AppController {

    private logger = new Logger('AppController');
    constructor(private readonly tumblrService: TumblrService) {}

    @Get()
   async getUserInfo(): Promise<any> {
        try {
            return await this.tumblrService.getUserInfo();
        } catch (e) {
            this.logger.error(`ERROR getting user info: ${e.message}`);
        }
    }
}
