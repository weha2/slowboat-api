import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../services/mail.service';

interface MailJob {
  invoiceNumber: string;
  attempts: number;
}

@Injectable()
export class MailListener {
  private readonly logger = new Logger(MailListener.name);
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds
  private queue: MailJob[] = [];
  private isProcessing = false;

  constructor(private readonly mailService: MailService) {}

  @OnEvent('mail.send')
  async handleMessage(invoiceNumber: string): Promise<void> {
    this.logger.log(`Adding mail job to queue: ${invoiceNumber}`);

    this.queue.push({
      invoiceNumber,
      attempts: 0,
    });

    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const job = this.queue[0];

    try {
      this.logger.log(
        `Processing mail job: ${job.invoiceNumber}. Attempt: ${job.attempts + 1}`,
      );
      await this.mailService.sendMail(job.invoiceNumber);

      this.logger.log(`Successfully sent mail: ${job.invoiceNumber}`);
      this.queue.shift(); // Remove successful job

      await this.processQueue(); // Process next job
    } catch (error) {
      this.logger.error(
        `Failed to send mail: ${job.invoiceNumber}. Attempt: ${job.attempts + 1}`,
      );
      this.logger.error(`Error: ${error.message}`);

      if (job.attempts < this.MAX_RETRIES - 1) {
        // Update attempts count
        job.attempts++;

        this.logger.log(`Retrying in ${this.RETRY_DELAY}ms...`);
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));

        await this.processQueue(); // Retry same job
      } else {
        this.logger.error(
          `All retry attempts failed for: ${job.invoiceNumber}`,
        );
        // Remove failed job after max retries
        this.queue.shift();

        // Continue with next job
        await this.processQueue();
      }
    }
  }
}
