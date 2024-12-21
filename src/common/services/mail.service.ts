import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketConfirmationData } from '../interfaces/ticket-confirmation';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly prismaService: PrismaService,
  ) {}

  async sendMail(invoiceNumber: string) {
    const data = await this.processOrder(invoiceNumber);
    if (data) {
      const html = await this.processTemplate(data);
      if (html) {
        try {
          await this.mailerService.sendMail({
            to: data.contact.email,
            subject: 'Ticket Purchase Confirmation',
            html: html,
          });
        } catch (error) {
          throw error;
        }
      } else {
        throw new Error('Not found email template!');
      }
    } else {
      throw new Error('Not found order!');
    }
  }

  private async processTemplate(data: TicketConfirmationData): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'ticket-confirmation.html',
    );
    let template = fs.readFileSync(templatePath, 'utf8');
    template = template
      .replace('#INVOICE_NUMBER#', data.invoiceNumber)
      .replace('#PRODUCT#', data.product.name)
      .replace('#PRICE#', `${data.product.price.formatCurrency()}`)
      .replace('#DEPARTURE_DATE#', data.product.departureDate)
      .replace('#PARTICIPANT#', data.product.participant.toString())
      .replace('#FIRST_NAME#', data.contact.firstName)
      .replace('#LAST_NAME#', data.contact.lastName)
      .replace('#EMAIL#', data.contact.email)
      .replace('#MOBILE#', data.contact.mobile)
      .replace('#PICKUP_LOCATION#', data.pickupLocation ?? '')
      .replace('#ADDITIONAL_REQUEST#', data.additionalRequest ?? '')
      .replace('#SUBTOTAL#', `${data.payment.subtotal.formatCurrency()}`)
      .replace('#DISCOUNT#', `${data.payment.discount.formatCurrency()}`)
      .replace('#TOTAL#', `${data.payment.total.formatCurrency()}`);
    return template;
  }

  private async processOrder(
    invoiceNumber: string,
  ): Promise<TicketConfirmationData | null> {
    const order = await this.prismaService.order.findUnique({
      where: {
        invoiceNumber: invoiceNumber,
      },
      include: {
        product: true,
        contact: {
          include: {
            countryCode: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Not found order!');
    }

    const { product, contact } = order;
    return {
      invoiceNumber: order.invoiceNumber,
      product: {
        name: product.name,
        price: order.price,
        departureDate: order.date.toISOString(),
        participant: order.quantity,
      },
      contact: {
        firstName: contact.firstname,
        lastName: contact.lastname,
        email: contact.email,
        mobile: `${contact.countryCode.dialCode} ${contact.phoneNumber}`,
      },
      pickupLocation: order.pickupLocation ?? '',
      additionalRequest: order.additionalRequest ?? '',
      payment: {
        subtotal: order.price * order.quantity,
        discount: 0,
        total: order.price * order.quantity,
      },
    };
  }
}
