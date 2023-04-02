import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {Blender, User} from '@drill-down/common'
import { logPerformance } from 'src/shared/decorators/logPerformance';
import * as _ from 'lodash';
import { AssetsService } from './assets.service';

@Injectable()
export class BlenderService implements OnModuleInit, OnModuleDestroy {
    private logger = new Logger('BlenderService');

    constructor(private userService: UserService, private assetsService: AssetsService) {

    }

    async onModuleInit() {
        this.logger.log('starting to render room based on theme and tags');
        const allUsers =  await this.userService.findAllUsers();
        const candidate = Math.floor(Math.random() * allUsers.length);
        const user = allUsers[candidate];

        this.renderUsersRoom(user)
        .then((result) => {
            this.logger.log(`finished rendering room for user ${user.email}`, JSON.stringify({
                result,
            }))
        })
        .catch((e)=> {
            this.logger.error(`an error occurred rendering user ${user.email} `)
        });
    }

    onModuleDestroy() {
        this.cleanUp();
    }

    @logPerformance()
    private async renderUsersRoom(user: User) {
        const {username} = user;
        const postsCountByTag = await this.userService.getPostsCountByTag(username);
        const tags = _.keys(postsCountByTag);

        const assets = await this.assetsService.findOrSchedule(user, tags);


        if (assets.length > 0) {
            const environment: Blender.EnvironmentDescription = {
                describedBy: username,
                lighting: [],
                objects: assets,
                camera: {
                    lens: {
                        type:'ortographic',
                        focalLength: 33,
                },         
            },
            
        }
    
            this.renderRoom(environment).then(() => {
                this.logger.warn(`rendered room for user ${username}`);
            });
        }
    }

    private async renderRoom(description: Blender.EnvironmentDescription){

    }

    private async cleanUp() {
        
    }
}
