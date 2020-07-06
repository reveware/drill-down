import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
// @UseGuards(AuthGuard(['jwt']))
export class AppController {
    private logger = new Logger('AppController');
    constructor(private readonly appService: AppService) {}

    @Get()
    async rootRequest(): Promise<any> {
        const identifier = 'rrriki';
        try {
            return await this.appService.crawlTumblrPosts(identifier);
        } catch (e) {
            this.logger.error(`ERROR crawling posts for ${identifier}: ${e.message}`);
        }
    }
}
