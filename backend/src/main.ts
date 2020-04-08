import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Configuration} from './configuration';
import {Logger} from '@nestjs/common';

const {HTTP_PORT} = Configuration;
const logger = new Logger('main');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(HTTP_PORT, ()=>{
        logger.log(`Server started listening on port ${HTTP_PORT}`)
    });
}
bootstrap();
