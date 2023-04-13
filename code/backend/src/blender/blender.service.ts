import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LogPerformance } from 'src/shared/decorators/LogPerformance';
import * as _ from 'lodash';
import { AssetsService } from './assets.service';
import { PostService } from 'src/post/post.service';
import { UserWithoutPassword, Blender} from 'src/shared/interfaces';

@Injectable()
export class BlenderService implements OnModuleInit, OnModuleDestroy {
    private logger = new Logger('BlenderService');

    constructor(private userService: UserService, private postService: PostService, private assetsService: AssetsService) {

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

    @LogPerformance()
    private async renderUsersRoom(user: UserWithoutPassword) {
        const {username} = user;
        const postsCountByTag = await this.postService.getPostsCountByTag(username);
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
