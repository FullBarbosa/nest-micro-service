import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CoursesService } from 'src/services/courses.service';
import { EnrollMentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';

export interface Customer {
  authUserId: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
}

export interface PurchaseCreatedPayload {
  customer: Customer;
  product: Product;
}

@Controller()
export class PurchaseController {
  constructor(
    private studentsServices: StudentsService,
    private enrollmentsServices: EnrollMentsService,
    private coursesServices: CoursesService,
  ) {}
  @EventPattern('purchases.new-purchase')
  async purchaseCreated(@Payload() payload: PurchaseCreatedPayload) {
    let student = await this.studentsServices.getStudentByAuthUserId(
      payload.customer.authUserId,
    );
    if (!student) {
      student = await this.studentsServices.createStudent({
        authUserId: payload.customer.authUserId,
      });
    }

    const course = await this.coursesServices.getCourseBySlug(
      payload.product.slug,
    );

    if (!course) {
      await this.coursesServices.createCourse({
        title: payload.product.title,
      });
    }

    await this.enrollmentsServices.createEnrollment({
      studentId: student.id,
      courseId: course.id,
    });
  }
}
