import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

export interface CreateCourseParam {
  title: string;
}

@Injectable()
export class CoursesService {
  constructor(private prismaService: PrismaService) {}

  listAllCourses() {
    return this.prismaService.course.findMany();
  }

  getCourseById(id: string) {
    return this.prismaService.course.findUnique({
      where: {
        id,
      },
    });
  }

  async createCourse({ title }: CreateCourseParam) {
    const slug = slugify(title, { lower: true });

    const courseAlreadyExists = await this.prismaService.course.findUnique({
      where: {
        slug,
      },
    });

    if (courseAlreadyExists) {
      throw new Error('Course already exists');
    }

    return this.prismaService.course.create({
      data: {
        title,
        slug,
      },
    });
  }
}
