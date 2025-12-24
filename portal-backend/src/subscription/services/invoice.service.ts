import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceStatus } from '../enum/invoice.enum';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async createInvoice(invoice: Stripe.Invoice) {
    const invoiceData: Partial<Invoice> = {
      stripeInvoiceId: invoice.id,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency.toUpperCase(),
      status: InvoiceStatus[invoice.status],
      billingReason: invoice.billing_reason,
      paidAt: invoice.status === 'paid' ? new Date() : null,
      createdAt: new Date(invoice.created * 1000),
    };

    const createdInvoice = await this.invoiceRepository.create(invoiceData);
    await this.invoiceRepository.save(createdInvoice);
  }

  async handleUpdateInvoice(invoice: Stripe.Invoice) {
    const existingInvoice = await this.invoiceRepository.findOne({
      where: { stripeInvoiceId: invoice.id },
    });

    if (existingInvoice) {
      existingInvoice.status = InvoiceStatus[invoice.status];
      existingInvoice.dueDate = new Date(invoice.due_date);
      existingInvoice.paidAt = new Date();
      existingInvoice.updatedAt = new Date(invoice.created * 1000);
      await this.invoiceRepository.save(existingInvoice);
    }
  }
}
