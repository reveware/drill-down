import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TumblrModule } from './providers/tumblr/tumblr.module';

@Module({
  imports: [TumblrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
