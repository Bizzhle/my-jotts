import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { EnvVars } from 'src/envvars';
import { EnvGetString } from '../../app/decorators/env-get.decorators';

@Injectable()
export class MailerService {
  @EnvGetString('FRONTEND_URL')
  frontend_url: string;
  private smtp_host: string;
  private smtp_port: number;
  private smtp_user: string;
  private smtp_pass: string;

  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService<EnvVars>) {
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

      const html = await this.loadTemplate('reset-password-confirmation.template', {
        emailAddress: to,
        token: forgotPasswordLink,
      });
      return await this.sendMail(to, 'Password reset request', html);
    } catch (error) {
      throw new Error(`Failed to send registration email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    try {
      const resetLink = `${this.frontend_url}/reset-password?token=${token}`;

      const html = await this.loadTemplate('reset-password.template', {
        emailAddress: to,
        token: resetLink,
      });

      return await this.sendMail(to, 'Password reset request', html);
    } catch (error) {
      throw new Error(`Failed to send registration email: ${error.message}`);
    }
  }

  async sendRegistrationEmail(to: string, token: string) {
    try {
      const confirmationLink = `${this.frontend_url}/account-confirmation?token=${token}&emailAddress=${to}`;
      const html = await this.loadTemplate('registration.template', {
        emailAddress: to,
        token: confirmationLink,
      });
      return await this.sendMail(to, 'Registration request', html);
    } catch (error) {
      throw new Error(`Failed to send registration email: ${error.message}`);
    }
  }

  private async loadTemplate(templateName: string, data: { emailAddress: string; token: string }) {
    const templatePath = path.resolve(__dirname, '../..', 'html-templates', `${templateName}.html`);

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Template not found: ${templatePath}`);
    }
    const template = fs.readFileSync(templatePath, 'utf-8');

    const compiledTemplate = handlebars.compile(template);

    return compiledTemplate(data);
  }
}
