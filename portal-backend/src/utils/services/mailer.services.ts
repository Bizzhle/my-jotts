import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { EnvVars } from 'src/envvars';
import { EnvGetString } from '../../app/decorators/env-get.decorators';
import { EmailJobName, QueueName } from '../../queue/constants/queue.constants';

@Injectable()
export class MailerService {
  @EnvGetString('FRONTEND_URL')
  frontend_url: string;
  private smtp_host: string;
  private smtp_port: number;
  private smtp_user: string;
  private smtp_pass: string;

  private transporter: nodemailer.Transporter;
  constructor(
    private configService: ConfigService<EnvVars>,
    @InjectQueue(QueueName.EMAIL) private queue: Queue,
  ) {
    this.smtp_host = this.configService.get<string>('SMTP_HOST');
    this.smtp_port = this.configService.get<number>('SMTP_PORT');
    this.smtp_user = this.configService.get<string>('SMTP_USER');
    this.smtp_pass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host: this.smtp_host,
      port: this.smtp_port,
      auth: {
        user: this.smtp_user,
        pass: this.smtp_pass,
      },
    });
  }

  async sendMail(email: string, subject: string, textOrHtml: string) {
    const mailOptions = {
      from: 'MyJotts',
      to: email,
      subject,
      ...(textOrHtml.startsWith('<') ? { html: textOrHtml } : { text: textOrHtml }),
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordConfirmation(to: string) {
    try {
      const forgotPasswordLink = `${this.frontend_url}/reset-password-confirmation`;

      return await this.queue.add(
        EmailJobName.SEND_RESET_PASSWORD_CONFIRMATION,
        { to, forgotPasswordLink },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send reset password confirmation email: ${err.message}`);
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    try {
      const resetLink = `${this.frontend_url}/reset-password?token=${token}`;

      return await this.queue.add(
        EmailJobName.SEND_PASSWORD_RESET,
        { to, resetLink },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send password reset email: ${err.message}`);
    }
  }

  async sendRegistrationEmail(to: string, token: string) {
    try {
      const confirmationLink = `${this.frontend_url}/account-confirmation?token=${token}&emailAddress=${to}`;

      return await this.queue.add(
        EmailJobName.SEND_REGISTRATION,
        { to, confirmationLink },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send registration email: ${err.message}`);
    }
  }

  async sendSupportRequestEmail(email: string, subject: string, description: string) {
    try {
      return await this.queue.add(
        EmailJobName.SEND_SUPPORT_REQUEST,
        { email, subject, description },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send support request email: ${err.message}`);
    }
  }
}
