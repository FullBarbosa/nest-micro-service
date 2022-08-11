import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'node:path';
import { DatabaseModule } from 'src/database/database.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { EnrollMentResolver } from './graphql/resolvers/enrollments.resolver';
import { StudentsResolver } from './graphql/resolvers/students.resolver';
import { CoursesService } from 'src/services/courses.service';
import { EnrollMentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';
import { CoursesResolver } from './graphql/resolvers/courses.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    //resolvers
    CoursesResolver,
    EnrollMentResolver,
    StudentsResolver,

    // services
    CoursesService,
    EnrollMentsService,
    StudentsService,
  ],
})
export class HttpModule {}
