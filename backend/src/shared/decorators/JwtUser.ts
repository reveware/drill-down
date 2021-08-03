import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';

export const JwtUser = createParamDecorator((data: unknown, context: ExecutionContext): UserDocument => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});
