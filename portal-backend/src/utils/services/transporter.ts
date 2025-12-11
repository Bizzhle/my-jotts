import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(email: string, subject: string, html: string) {
  const mailOptions = {
    from: `Myjotts <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}
