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
        participant: {
          include: {
            countryCode: true,
            countryNationality: true,
            gender: true,
          },
        },
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
        lastname: contact.lastname,
        firstname: contact.firstname,
        email: contact.email,
        countryCodeId: contact.countryCodeId,
        phoneNumber: contact.phoneNumber,
      },
      participants: participant.flatMap((participant) => ({
        id: participant.id,
        lastname: participant.lastname,
        firstname: participant.firstname,
        email: participant.email,
        countryCodeId: participant?.countryCodeId,
        countryCodeName: participant?.countryCode?.name,
        phoneNumber: participant.phoneNumber,
        genderId: participant.gender?.id,
        genderName: participant.gender?.name,
        dateBirth: participant.dateBirth,
        passportNumber: participant.passportNumber,
        countryNationalityId: participant?.countryNationalityId,
        countryNationalityName: participant.countryNationality?.enShortName,
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
          lastname: contact.lastname,
          firstname: contact.firstname,
          email: contact.email,
          countryCodeId: contact.countryCodeId,
          phoneNumber: contact.phoneNumber,
        },
      });

      await tx.participant.createMany({
        data: participants.map((participant) => {
          return {
            orderId: orderId,
            lastname: participant.lastname,
            firstname: participant.firstname,
            email: participant.email,
            countryCodeId: participant.countryCodeId,
            phoneNumber: participant.phoneNumber,
            genderId: participant.genderId,
            passportNumber: participant.passportNumber,
            countryNationalityId: participant.countryNationalityId,
            ...(participant.dateBirth && {
              dateBirth: participant.dateBirth,
            }),
          };
        }),
      });

      return { id: orderId };
    });

    return this.findOne(id);
  }
}
