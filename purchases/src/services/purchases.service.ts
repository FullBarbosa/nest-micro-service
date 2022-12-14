import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KafkaService } from 'src/messaging/kafka.service';

interface CreatePurchaseParam {
  productId: string;
  customerId: string;
}

@Injectable()
export class PurchasesService {
  constructor(
    private prismaService: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

  listAllProducts() {
    return this.prismaService.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  listAllFromCustomer(customerId: string) {
    return this.prismaService.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createPurchase({ customerId, productId }: CreatePurchaseParam) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const purchase = await this.prismaService.purchase.create({
      data: {
        customerId,
        productId,
      },
    });

    const customer = await this.prismaService.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    this.kafkaService.emit('purchases.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },

      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return purchase;
  }
}
