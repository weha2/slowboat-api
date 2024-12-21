import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderDto } from './dtos/order.dto';
import { PaymentStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  private generateHash(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async getNextInvoiceNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}${month}`;

    const lastInvoice = await this.prismaService.order.findFirst({
      where: {
        invoiceNumber: {
          contains: `-${prefix}-`,
        },
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
    });

    let newNumber: number;
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.slice(-4));
      newNumber = lastNumber + 1;
    } else {
      newNumber = 1;
    }

    return `${this.generateHash()}-${prefix}-${String(newNumber).padStart(4, '0')}`;
  }

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
      invoiceNumber: order.invoiceNumber,
      orderId: order.id,
      productId: order.productId,
      price: order.price,
      quantity: order.quantity,
      date: order.date,
      pickupLocation: order.pickupLocation,
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

  async create(body: OrderDto): Promise<any> {
    return this.prismaService.$transaction(async (tx) => {
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

      const invoiceNumber = await this.getNextInvoiceNumber();
      const quantity = body.participants.length;

      const { id: orderId } = await tx.order.create({
        data: {
          invoiceNumber: invoiceNumber,
          productId: item.id,
          quantity: quantity,
          price: item.price,
          date: body.date,
          pickupLocation: body.pickupLocation,
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

      const amount = item.price * quantity * 100;

      return {
        invoiceNumber: invoiceNumber,
        defaultPaymentMethod: 'credit_card',
        frameLabel: 'Slowboat Laos',
        amount: amount,
        currency: 'thb',
      };
    });
  }
}
