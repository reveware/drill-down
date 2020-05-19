import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import passport from 'passport';
import * as redis from 'redis';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { AppModule } from './app.module';
import { Configuration } from './configuration';
import { HttpExceptionFilter } from './shared/filters';
import { ValidationPipe } from './shared/pipes';

const { HTTP_PORT } = Configuration;
const logger = new Logger('main');

const RedisStore = connectRedis(session);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.use(
        session({
            secret: 'blablabla',
            store: new RedisStore({ client: redis.createClient() }),
            resave: true,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // Add custom validation pipe
    app.useGlobalPipes(new ValidationPipe());
    // Add custom HTTP exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(HTTP_PORT, () => {
        logger.log(`Server started listening on port ${HTTP_PORT}`);
    });
}

bootstrap();
