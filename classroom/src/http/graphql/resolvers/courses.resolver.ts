import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CoursesService } from 'src/services/courses.service';
import { Course } from '../models/course';
import { CreateCourseInput } from '../inputs/create-couse-input';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { StudentsService } from 'src/services/students.service';
import { EnrollMentsService } from 'src/services/enrollments.service';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly studentsService: StudentsService,
    private readonly enrollmentsService: EnrollMentsService,
  ) {}

  @Query(() => [Course])
  @UseGuards(AuthorizationGuard)
  courses() {
    return this.coursesService.listAllCourses();
  }

  @Mutation(() => Course)
  @UseGuards(AuthorizationGuard)
  createCourse(@Args('data') data: CreateCourseInput) {
    return this.coursesService.createCourse(data);
  }

  @Query(() => Course)
  @UseGuards(AuthorizationGuard)
  async course(@Args('id') id: string, @CurrentUser() user: AuthUser) {
    const student = await this.studentsService.getStudentByAuthUserId(user.sub);
    if (!student) {
      throw new Error('Student not found');
    }

    const enrollment = await this.enrollmentsService.getByCourseAndStudentId(
      id,
      student.id,
    );
    if (!enrollment) {
      throw new UnauthorizedException();
    }
    return this.coursesService.getCourseById(id);
  }
}
