import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as Omise from 'omise';
import * as process from 'node:process';
import { CreateChargeDto } from './dtos/create-charge.dto';
import { Charge } from './dtos/charge.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PaymentService {
  private omise: Omise.IOmise | null = null;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {
    this.omise = Omise({
      publicKey: process.env.OMISE_PUBLIC_KEY,
      secretKey: process.env.OMISE_SECRET_KEY,
    });
  }

  async createCharge(body: CreateChargeDto): Promise<any> {
    const existing = await this.prismaService.order.findUnique({
      where: {
        invoiceNumber: body.invoiceNumber ?? '',
      },
    });

    if (!existing) {
      throw new BadRequestException('Invalid invoice number or token!');
    }

    try {
      const result = await this.omise.charges.create({
        amount: body.amount,
        currency: 'thb',
        card: body.token,
        capture: true,
      });

      if (result && result.paid) {
        const order = await this.prismaService.order.update({
          where: {
            invoiceNumber: body.invoiceNumber,
          },
          data: {
            status: 'COMPLETED',
            token: body.token,
            completedAt: new Date(),
          },
          include: {
            contact: true,
          },
        });
        this.emitter.emit('mail.send', order.invoiceNumber);
      }

      return {
        invoiceNumber: body.invoiceNumber,
        amount: result.amount,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Payment processing failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async retrieveCharge(chargeId: string): Promise<Charge> {
    try {
      const charge = await this.omise.charges.retrieve(chargeId);
      return {
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
        paid: charge.paid,
        transaction: `${charge.transaction}`,
        created_at: charge.created_at,
      };
    } catch (error) {
      throw error;
    }
  }
}
