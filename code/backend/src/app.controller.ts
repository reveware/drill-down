import { Controller, Get, HttpStatus, Logger, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { JwtUser } from './shared/decorators';

import express from 'express';
import { User } from '@prisma/client';
@Controller()
@UseGuards(AuthGuard(['jwt']))
export class AppController {
    private logger = new Logger('AppController');
    constructor(private readonly appService: AppService) {}

    @Get()
    async rootRequest(@JwtUser() user: User, @Response() res: express.Response): Promise<any> {
        this.logger.log(`Crawling tumblr posts for user ${user.username}`);
        this.appService
            .crawlTumblrPosts(user, 5)
            .then((result) => {
                this.logger.log(`Finished crawling posts for user ${user.username}: ${JSON.stringify(result)}`);
            })
            .catch((e) => {
                this.logger.error(`Error crawling posts for ${user.username}: ${e.message}`);
            });

        return res.status(HttpStatus.CREATED).json({});
    }
}
