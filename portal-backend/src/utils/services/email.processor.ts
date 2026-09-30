import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { EmailJobName, QueueName } from '../../queue/constants/queue.constants';
import { DeadLetterService } from '../../queue/dead-letter.service';
import { sendEmail } from './transporter';

export interface SendResetPasswordConfirmationPayload {
  to: string;
  forgotPasswordLink: string;
}

export interface SendPasswordResetPayload {
  to: string;
  resetLink: string;
}

export interface SendRegistrationPayload {
  to: string;
  confirmationLink: string;
}

export interface SendSupportRequestPayload {
  email: string;
  subject: string;
  description: string;
}

export interface SendVerificationEmailPayload {
  to: string;
  url: string;
}

@Processor(QueueName.EMAIL)
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly deadLetterService: DeadLetterService,
    private readonly appLogger: AppLoggerService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.appLogger.log(`Processing email job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case EmailJobName.SEND_RESET_PASSWORD_CONFIRMATION:
        return this.handleResetPasswordConfirmation(job.data);
      case EmailJobName.SEND_PASSWORD_RESET:
        return this.handlePasswordReset(job.data);
      case EmailJobName.SEND_REGISTRATION:
        return this.handleRegistration(job.data);
      case EmailJobName.SEND_SUPPORT_REQUEST:
        return this.handleSupportRequest(job.data);
      case EmailJobName.SEND_VERIFICATION_EMAIL:
        return this.handleVerificationEmail(job.data);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  @OnWorkerEvent('failed')
  async handleFailedJob(job: Job | undefined, error: Error): Promise<void> {
    if (!job || job.attemptsMade < (job.opts.attempts ?? 1)) {
      return;
    }

    this.appLogger.error(`Email job ${job.id} exhausted retries`);
    await this.deadLetterService.recordFailure(QueueName.EMAIL, job, error);
  }

  private async handleResetPasswordConfirmation(payload: SendResetPasswordConfirmationPayload) {
    const { to, forgotPasswordLink } = payload;
    const html = await this.loadTemplate('reset-password-confirmation.template', {
      emailAddress: to,
      token: forgotPasswordLink,
    });
    return await sendEmail(to, 'Password reset request', html);
  }

  private async handlePasswordReset(payload: SendPasswordResetPayload) {
    const { to, resetLink } = payload;
    const html = await this.loadTemplate('reset-password.template', {
      emailAddress: to,
      url: resetLink,
    });
    return await sendEmail(to, 'Password reset request', html);
  }

  private async handleRegistration(payload: SendRegistrationPayload) {
    const { to, confirmationLink } = payload;
    const html = await this.loadTemplate('registration.template', {
      emailAddress: to,
      token: confirmationLink,
    });
    return await sendEmail(to, 'Registration request', html);
  }

  private async handleSupportRequest(payload: SendSupportRequestPayload) {
    const { email, subject, description } = payload;
    const emailSubject = subject.startsWith('Support Request:')
      ? subject
      : `Support Request: ${subject}`;
    return await sendEmail(email, emailSubject, description);
  }

  private async loadTemplate(templateName: string, data: Record<string, any>): Promise<string> {
    const templatePath = path.resolve(__dirname, '../..', 'html-templates', `${templateName}.html`);

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Template not found: ${templatePath}`);
    }
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);

    return compiledTemplate(data);
  }
  private async handleVerificationEmail(payload: SendVerificationEmailPayload) {
    const { to, url } = payload;
    const html = await this.loadTemplate('email-verification.template', {
      emailAddress: to,
      url,
    });
    return await sendEmail(to, 'Verification Email', html);
  }
}
