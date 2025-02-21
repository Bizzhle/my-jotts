import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EnvGetString } from '../../app/decorators/env-get.decorators';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class MailerService {
  @EnvGetString('FRONTEND_URL')
  frontend_url: string;

  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'laurianne28@ethereal.email',
        pass: 'ys1ZdkEU5u55vJH7Km',
      },
    });
  }

  async sendMail(email: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${this.frontend_url}/reset-password?token=${token}`;

    const html = await this.loadTemplate('reset-password.template', {
      emailAddress: to,
      token: resetLink,
    });
    const mailOptions = {
      from: 'Jotta',
      to,
      subject: 'Password reset request',
      html,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  private async loadTemplate(templateName: string, data: { emailAddress: string; token: string }) {
    const templatePath = path.resolve(__dirname, '../..', 'html-templates', `${templateName}.html`);

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Template not found: ${templatePath}`);
    }
    const template = fs.readFileSync(templatePath, 'utf-8');

    const compiledTemplate = handlebars.compile(template);
    console.log(data);

    return compiledTemplate(data);
  }
}
