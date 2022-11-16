import { Controller, Get, HttpStatus, Logger, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { JwtUser } from './shared/decorators';
import { Populated, User } from '@drill-down/interfaces';
import express from 'express';
@Controller()
@UseGuards(AuthGuard(['jwt']))
export class AppController {
    private logger = new Logger('AppController');
    constructor(private readonly appService: AppService) {}

    @Get()
    async rootRequest(@JwtUser() user: Populated<User>, @Response() res: express.Response): Promise<any> {
        this.appService
            .crawlTumblrPosts(user)
            .then((result) => {
                this.logger.log(`finished crawling posts for user ${user.username}: ${JSON.stringify(result)}`);
            })
            .catch((e) => {
                this.logger.error(`ERROR crawling posts for ${user.username}: ${e.message}`);
            });

        return res.status(HttpStatus.CREATED).json({});
    }
}
