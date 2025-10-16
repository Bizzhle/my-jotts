import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import { NotFoundException } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import * as path from 'path';
import { AppDataSource } from './sql/data-source';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(email: string, subject: string, html: string) {
  const mailOptions = {
    from: 'MyJotts',
    to: email,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}

AppDataSource.initialize();
export const auth = betterAuth({
  url: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: typeormAdapter(AppDataSource),
  emailAndPassword: { enabled: true, requireEmailVerification: true },
  sendVerificationEmail: async ({ user, url, token }) => {
    console.log('Verification URL:', url);

    const html = await loadTemplate('email-verification.template', {
      emailAddress: user.email,
      url: url,
    });
    await sendEmail(user.email, 'Verify your email', html);
  },

  trustedOrigins: ['http://localhost:4000'],
});

export const initializeAuth = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

const loadTemplate = async (
  templateName: string,
  data: { emailAddress: string; url: string; token?: string },
) => {
  const templatePath = path.resolve(__dirname, '../..', 'html-templates', `${templateName}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new NotFoundException(`Template not found: ${templatePath}`);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(template);

  return compiledTemplate(data);
};
