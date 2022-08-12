import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [HttpModule, MessagingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
