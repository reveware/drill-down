import { AuthGuard } from '@nestjs/passport';
import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class TumblrGuard extends AuthGuard('tumblr') implements CanActivate {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }

    public handleRequest(e: Error, user: any): any {
        if (e) {
            console.log('error', e.message);
            throw e;
        }

        return { name: 'riki' };
    }
}
