import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private addCleanPasswordMiddleware = true;

    constructor() {
        super({
            log: [
             // { level: 'query', emit: 'stdout' },
                { level: 'info', emit: 'stdout' },
                { level: 'warn', emit: 'stdout' },
                { level: 'error', emit: 'stdout' },
            ],
        });
        this.addMiddleware();
    }

    public async onModuleInit() {
        await this.$connect();
    }

    public async findUserWithPasswordByEmail(email: string) {
        this.addCleanPasswordMiddleware = false;
        const user = await this.user.findUnique({ where: { email } });
        this.addCleanPasswordMiddleware = true;
        return user;
    }

    public async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }

    private addMiddleware() {
        this.$use(async (params, next) => {
            const result = await next(params);

            if (params.model === 'User' && this.addCleanPasswordMiddleware) {
                if (Array.isArray(result)) {
                    return result.map(this.cleanUserPrivateInfo);
                }
                if (result) {
                    return this.cleanUserPrivateInfo(result);
                }
            }

            return result;
        });
    }

    private cleanUserPrivateInfo(user: User): Omit<User, 'password'> {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
