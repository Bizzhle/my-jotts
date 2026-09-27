import { EmailJobName } from '../../../queue/constants/queue.constants';
import { EmailProcessor } from '../email.processor';
import { sendEmail } from '../transporter';

jest.mock('@nestjs/bullmq', () => ({
  Processor: () => () => undefined,
  WorkerHost: class WorkerHost {},
}));

jest.mock('../transporter', () => ({
  sendEmail: jest.fn(),
}));

const sendEmailMock = sendEmail as jest.Mock;

describe('EmailProcessor', () => {
  let processor: EmailProcessor;

  beforeEach(() => {
    sendEmailMock.mockReset();
    sendEmailMock.mockResolvedValue({ messageId: 'message-1' });
    processor = new EmailProcessor();
  });

  it('sends a reset password confirmation email with the templated body', async () => {
    await processor.process({
      id: 'job-1',
      name: EmailJobName.SEND_RESET_PASSWORD_CONFIRMATION,
      data: { to: 'user@example.com', forgotPasswordLink: 'https://app/forgot' },
    } as never);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [to, subject, html] = sendEmailMock.mock.calls[0];
    expect(to).toBe('user@example.com');
    expect(subject).toBe('Password reset request');
    expect(html).toContain('https://app/forgot');
  });

  it('sends a password reset email with the templated body', async () => {
    await processor.process({
      id: 'job-2',
      name: EmailJobName.SEND_PASSWORD_RESET,
      data: { to: 'user@example.com', resetLink: 'https://app/reset' },
    } as never);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [to, subject, html] = sendEmailMock.mock.calls[0];
    expect(to).toBe('user@example.com');
    expect(subject).toBe('Password reset request');
    expect(html).toContain('https://app/reset');
  });

  it('sends a registration email with the templated body', async () => {
    await processor.process({
      id: 'job-3',
      name: EmailJobName.SEND_REGISTRATION,
      data: { to: 'user@example.com', confirmationLink: 'https://app/confirm' },
    } as never);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [to, subject, html] = sendEmailMock.mock.calls[0];
    expect(to).toBe('user@example.com');
    expect(subject).toBe('Registration request');
    expect(html).toContain('https://app/confirm');
  });

  it('sends a verification email with the templated body', async () => {
    await processor.process({
      id: 'job-4',
      name: EmailJobName.SEND_VERIFICATION_EMAIL,
      data: { to: 'user@example.com', url: 'https://app/verify' },
    } as never);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [to, subject, html] = sendEmailMock.mock.calls[0];
    expect(to).toBe('user@example.com');
    expect(subject).toBe('Verification Email');
    expect(html).toContain('https://app/verify');
  });

  it('sends a support request email without a template, prefixing the subject', async () => {
    await processor.process({
      id: 'job-5',
      name: EmailJobName.SEND_SUPPORT_REQUEST,
      data: {
        email: 'support@example.com',
        subject: 'Cannot upload image',
        description: 'Uploads fail with a 500 error.',
      },
    } as never);

    expect(sendEmailMock).toHaveBeenCalledWith(
      'support@example.com',
      'Support Request: Cannot upload image',
      'Uploads fail with a 500 error.',
    );
  });

  it('does not double-prefix a support request subject that already has the prefix', async () => {
    await processor.process({
      id: 'job-6',
      name: EmailJobName.SEND_SUPPORT_REQUEST,
      data: {
        email: 'support@example.com',
        subject: 'Support Request: Cannot upload image',
        description: 'Uploads fail with a 500 error.',
      },
    } as never);

    expect(sendEmailMock).toHaveBeenCalledWith(
      'support@example.com',
      'Support Request: Cannot upload image',
      'Uploads fail with a 500 error.',
    );
  });

  it('throws for an unknown job name', async () => {
    await expect(
      processor.process({ id: 'job-7', name: 'unknown-job', data: {} } as never),
    ).rejects.toThrow('Unknown job name: unknown-job');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});
