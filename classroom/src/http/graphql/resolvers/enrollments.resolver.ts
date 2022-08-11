import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { CoursesService } from 'src/services/courses.service';
import { EnrollMentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';
import { Enrollment } from '../models/enrollment';

@Resolver(() => Enrollment)
export class EnrollMentResolver {
  constructor(
    private readonly enrollmentService: EnrollMentsService,
    private readonly courseService: CoursesService,
    private readonly studentService: StudentsService,
  ) {}

  @Query(() => [Enrollment])
  @UseGuards(AuthorizationGuard)
  enrollments() {
    return this.enrollmentService.listAllEnrollments();
  }

  @ResolveField()
  student(@Parent() enrollment: Enrollment) {
    return this.studentService.getStudentById(enrollment.studentId);
  }

  @ResolveField()
  course(@Parent() enrollment: Enrollment) {
    return this.courseService.getCourseById(enrollment.courseId);
  }
}
