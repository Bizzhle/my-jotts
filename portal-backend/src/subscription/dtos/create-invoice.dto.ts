import { InvoiceStatus } from '../enum/invoice.enum';

export class CreateInvoiceDto {
  stripeInvoiceId: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: InvoiceStatus;
  billingReason: string;
  paidAt: Date | null;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
}
