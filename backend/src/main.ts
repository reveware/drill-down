import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Configuration} from './configuration';
import { Logger} from '@nestjs/common';
import {HttpExceptionFilter} from './shared/filters';
import {ValidationPipe} from './shared/pipes';

const {HTTP_PORT} = Configuration;
const logger = new Logger('main');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    // Add custom validation pipe
    app.useGlobalPipes(new ValidationPipe());
    // Add custom HTTP exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(HTTP_PORT, ()=>{
        logger.log(`Server started listening on port ${HTTP_PORT}`)
    });
}
bootstrap();
