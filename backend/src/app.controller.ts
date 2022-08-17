import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { JwtUser } from './shared/decorators';
import { Populated, User} from "@drill-down/interfaces";

@Controller()
@UseGuards(AuthGuard(['jwt']))
export class AppController {
    private logger = new Logger('AppController');
    constructor(private readonly appService: AppService) {}

    @Get()
    async rootRequest(@JwtUser() user: Populated<User>): Promise<any> {
        try {
            return await this.appService.crawlTumblrPosts(user);
        } catch (e) {
            this.logger.error(`ERROR crawling posts for ${user.username}: ${e.message}`);
        }
    }
}
