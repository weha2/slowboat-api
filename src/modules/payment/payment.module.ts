import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailService } from '../../common/services/mail.service';
import { MailListener } from '../../common/listeners/mail.listener';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService, MailService, MailListener],
})
export class PaymentModule {}
