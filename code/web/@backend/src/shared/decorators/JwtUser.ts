import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';


export const JwtUser = createParamDecorator((data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});
