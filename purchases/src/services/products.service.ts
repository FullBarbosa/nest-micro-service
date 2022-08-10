import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface ICreateProductParam {
  title: string;
}

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  listAllProducts() {
    return this.prismaService.product.findMany();
  }

  getProductById(id: string) {
    return this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
  }

  async createProduct({ title }: ICreateProductParam) {
    const slug = slugify(title, { lower: true });

    const productWithSameSlug = await this.prismaService.product.findUnique({
      where: {
        slug,
      },
    });

    if (productWithSameSlug) {
      throw new Error('Another product with the same slug already exists');
    }

    return this.prismaService.product.create({
      data: {
        title,
        slug,
      },
    });
  }
}
