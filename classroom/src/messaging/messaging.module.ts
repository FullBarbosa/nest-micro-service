import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';
import { Module } from '@nestjs/common';
import { PurchaseController } from './controllers/purchases.controller';
import { StudentsService } from 'src/services/students.service';
import { EnrollMentsService } from 'src/services/enrollments.service';
import { CoursesService } from 'src/services/courses.service';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [PurchaseController],
  providers: [
    KafkaService,
    StudentsService,
    EnrollMentsService,
    CoursesService,
  ],
  exports: [KafkaService],
})
export class MessagingModule {}
