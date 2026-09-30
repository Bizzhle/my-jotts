export enum QueueName {
  EMAIL = 'email',
  IMAGE_PROCESSING = 'image-processing',
  DEAD_LETTER = 'dead-letter',
}

export enum EmailJobName {
  SEND_RESET_PASSWORD_CONFIRMATION = 'send-reset-password-confirmation',
  SEND_PASSWORD_RESET = 'send-password-reset',
  SEND_REGISTRATION = 'send-registration',
  SEND_SUPPORT_REQUEST = 'send-support-request',
  SEND_VERIFICATION_EMAIL = 'send-verification-email',
}

export enum ImageJobName {
  PROCESS_ACTIVITY_IMAGE_UPLOAD = 'process-activity-image-upload',
  PROCESS_ACTIVITY_IMAGE_DELETE = 'process-activity-image-delete',
}

// Backward-compatible individual constant aliases
export const EMAIL_QUEUE = QueueName.EMAIL;
export const IMAGE_PROCESSING_QUEUE = QueueName.IMAGE_PROCESSING;

export const SEND_RESET_PASSWORD_CONFIRMATION = EmailJobName.SEND_RESET_PASSWORD_CONFIRMATION;
export const SEND_PASSWORD_RESET = EmailJobName.SEND_PASSWORD_RESET;
export const SEND_REGISTRATION = EmailJobName.SEND_REGISTRATION;
export const SEND_SUPPORT_REQUEST = EmailJobName.SEND_SUPPORT_REQUEST;
export const SEND_VERIFICATION_EMAIL = EmailJobName.SEND_VERIFICATION_EMAIL;
export const PROCESS_ACTIVITY_IMAGE_UPLOAD = ImageJobName.PROCESS_ACTIVITY_IMAGE_UPLOAD;
export const PROCESS_ACTIVITY_IMAGE_DELETE = ImageJobName.PROCESS_ACTIVITY_IMAGE_DELETE;
