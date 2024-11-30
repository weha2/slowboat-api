import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingDto } from './dtos/booking.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<BookingDto> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: {
        contact: true,
        participant: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Not found booking.`);
    }

    const { contact, participant } = booking;

    return {
      bookingId: booking.id,
      packageId: booking.packageId,
      price: booking.price,
      quantity: booking.quantity,
      date: booking.date,
      additionalRequest: booking.additionalRequest,
      status: booking.status,
      statusMessage: booking.statusMessage || null,
      completedAt: booking.completedAt || null,
      contact: {
        name: contact.name,
        email: contact.email,
        phoneCode: contact.phoneCode,
        numberPhone: contact.numberPhone,
      },
      participants: participant.flatMap((participant) => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phoneCode: participant.phoneCode,
        numberPhone: participant.numberPhone,
        dateBirth: participant.dateBirth,
        passportNumber: participant.passportNumber,
      })),
    };
  }

  async create(body: BookingDto): Promise<BookingDto> {
    const { id } = await this.prismaService.$transaction(async (tx) => {
      const { id } = await tx.booking.create({
        data: {
          packageId: body.packageId,
          quantity: body.quantity,
          price: body.price,
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
          bookingId: id,
          name: contact.name,
          email: contact.email,
          phoneCode: contact.phoneCode,
          numberPhone: contact.numberPhone,
        },
      });

      await tx.participant.createMany({
        data: participants.map((participant) => ({
          bookingId: id,
          name: participant.name,
          email: participant.email,
          phoneCode: participant.phoneCode,
          numberPhone: participant.numberPhone,
          dateBirth: participant.dateBirth,
          passportNumber: participant.passportNumber,
        })),
      });

      return { id };
    });

    return this.findOne(id);
  }
}
