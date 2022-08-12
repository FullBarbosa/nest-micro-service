import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateStudentParam {
  authUserId: string;
  slug?: string;
}

@Injectable()
export class StudentsService {
  constructor(private prismaService: PrismaService) {}

  listAllStudents() {
    return this.prismaService.student.findMany();
  }

  getStudentById(id: string) {
    return this.prismaService.student.findUnique({
      where: {
        id,
      },
    });
  }

  getStudentByAuthUserId(authUserId: string) {
    return this.prismaService.student.findUnique({
      where: {
        authUserId,
      },
    });
  }

  createStudent({ authUserId }: CreateStudentParam) {
    return this.prismaService.student.create({
      data: {
        authUserId,
      },
    });
  }
}
