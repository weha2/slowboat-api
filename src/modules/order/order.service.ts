import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderDto } from './dtos/order.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<OrderDto> {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: {
        contact: true,
        participant: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Not found booking.`);
    }

    const { contact, participant } = order;

    return {
      orderId: order.id,
      productId: order.productId,
      price: order.price,
      quantity: order.quantity,
      date: order.date,
      additionalRequest: order.additionalRequest,
      status: order.status,
      statusMessage: order.statusMessage || null,
      completedAt: order.completedAt || null,
      contact: {
        name: contact.name,
        email: contact.email,
        phoneCode: contact.phoneCode,
        phoneNumber: contact.phoneNumber,
      },
      participants: participant.flatMap((participant) => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phoneCode: participant.phoneCode,
        phoneNumber: participant.phoneNumber,
        gender: participant.gender,
        dateBirth: participant.dateBirth,
        passportNumber: participant.passportNumber,
        nationality: participant.nationality,
      })),
    };
  }

  async create(body: OrderDto): Promise<OrderDto> {
    const { id } = await this.prismaService.$transaction(async (tx) => {
      const item = await tx.product.findUnique({
        where: { id: body.productId },
        select: {
          id: true,
          price: true,
        },
      });

      if (!item) {
        throw new NotFoundException(`Not found package.`);
      }

      const { id: orderId } = await tx.order.create({
        data: {
          productId: item.id,
          quantity: body.quantity,
          price: item.price,
          date: body.date,
          additionalRequest: body.additionalRequest,
          status: PaymentStatus.PENDING,
        },
        select: {
          id: true,
        },
      });

      const { contact, participants } = body;

      await tx.contact.create({
        data: {
          orderId: orderId,
          name: contact.name,
          email: contact.email,
          phoneCode: contact.phoneCode,
          phoneNumber: contact.phoneNumber,
        },
      });

      await tx.participant.createMany({
        data: participants.map((participant) => ({
          orderId: orderId,
          name: participant.name,
          email: participant.email,
          phoneCode: participant.phoneCode,
          phoneNumber: participant.phoneNumber,
          dateBirth: participant.dateBirth,
          gender: participant.gender,
          passportNumber: participant.passportNumber,
          nationality: participant.nationality,
        })),
      });

      return { id: orderId };
    });

    return this.findOne(id);
  }
}
