import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';

import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import { AppModule } from './app.module';
import { Configuration } from './configuration';
import { HttpExceptionFilter } from './shared/filters';
import { ValidationPipe } from './shared/pipes';

const logger = new Logger('server');

const { HTTP_PORT } = Configuration;

const RedisStore = connectRedis(session);
const redisConfig = Configuration.getRedisConfig();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.use(
        session({
            secret: redisConfig.redis_secret,
            store: new RedisStore({ client: redis.createClient() }),
            resave: true,
            saveUninitialized: false,
        })
    );

    // Add custom validation pipe
    app.useGlobalPipes(new ValidationPipe());
    // Add custom HTTP exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(HTTP_PORT, () => {
        logger.log(`Server started listening on port ${HTTP_PORT}`);
    });
}

bootstrap();
