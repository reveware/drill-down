import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as redis from 'redis';
import RedisStore from 'connect-redis';
import { AppModule } from './app.module';
import { Configuration } from './configuration';
import { HttpExceptionFilter } from './shared/filters';
import { ValidationPipe } from './shared/pipes';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('server');

const { HTTP_PORT } = Configuration;

const redisConfig = Configuration.getRedisConfig();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const redisClient = redis.createClient({ url: redisConfig.redis_url, password: redisConfig.redis_secret });

    const redisStore: any = new (RedisStore as any)({client: redisClient})
    
    app.use(
        session({
            secret: redisConfig.redis_secret,
            store: redisStore,
            resave: true,
            saveUninitialized: false,
        })
    );

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());

    const swaggerOptions = new DocumentBuilder()
        .setTitle('DrillDown API')
        .setDescription('These are the definitions for endpoints used by the Drill Down app.')
        .setVersion('1.0')
        .build();

    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerOptions));

    await app.listen(HTTP_PORT, () => {
        logger.log(`Server started listening on port ${HTTP_PORT}`);
    });
}

bootstrap();
