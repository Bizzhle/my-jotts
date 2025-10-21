import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import { NotFoundException } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
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
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.DOMAIN;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;

const trustedOrigins = [FRONTEND_URL, BACKEND_URL, BETTER_AUTH_URL].filter(
  (url): url is string => !!url && /^https?:\/\//.test(url),
);

console.log('Trusted Origins:', trustedOrigins);

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
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      const frontendUrl = process.env.FRONTEND_URL;
      const callbackURL = `${frontendUrl}/reset-password?token=${token}`;
      const html = await loadTemplate('reset-password.template', {
        emailAddress: user.email,
        url: callbackURL,
      });
      await sendEmail(user.email, 'Reset your password', html);
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Send verification email on signup
    autoSignInAfterVerification: true, // Optional: auto sign-in after verification
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const frontendUrl = process.env.FRONTEND_URL;
      const callbackURL = `${frontendUrl}/verify-email?token=${token}`;

      const html = await loadTemplate('email-verification.template', {
        emailAddress: user.email,
        url: callbackURL,
      });

      await sendEmail(user.email, 'Verify your email', html);
    },
  },
  trustedOrigins,
  basePath: '/api/auth',
  exposeRoutes: false,
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
  const baseDir =
    process.env.NODE_ENV === 'production'
      ? path.resolve(process.cwd(), 'dist', 'src', 'html-templates')
      : path.resolve(process.cwd(), 'src', 'html-templates');

  const templatePath = path.resolve(baseDir, `${templateName}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new NotFoundException(`Template not found: ${templatePath}`);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(template);

  return compiledTemplate(data);
};
