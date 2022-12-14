import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateEnrollmentParam {
  studentId: string;
  courseId: string;
}

@Injectable()
export class EnrollMentsService {
  constructor(private prismaService: PrismaService) {}

  getByCourseAndStudentId(courseId: string, studentId: string) {
    return this.prismaService.enrollment.findFirst({
      where: {
        courseId,
        studentId,
        canceledAt: null,
      },
    });
  }

  listAllEnrollments() {
    return this.prismaService.enrollment.findMany();
  }

  getEnrollmentsByStudentId(studentId: string) {
    return this.prismaService.enrollment.findMany({
      where: {
        studentId,
        canceledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  createEnrollment({ courseId, studentId }: CreateEnrollmentParam) {
    return this.prismaService.enrollment.create({
      data: {
        studentId,
        courseId,
      },
    });
  }
}
