import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class MessagingModule {}
