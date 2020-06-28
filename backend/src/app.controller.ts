import {Controller, Get, Logger, UseGuards} from '@nestjs/common';
import {TumblrService} from './providers/tumblr/tumblr.service';
import {AuthGuard} from '@nestjs/passport';

@Controller()
@UseGuards(AuthGuard(['jwt']))
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
