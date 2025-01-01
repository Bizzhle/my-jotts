import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../../entities/invoice.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceStatus } from '../../enum/invoice.enum';
import Stripe from 'stripe';

const stripeInvoice: Stripe.Invoice = {
  id: 'invoice_ida',
  amount_due: 499,
  amount_paid: 499,
  currency: 'EUR',
  status: InvoiceStatus.open,
  billing_reason: 'subscription_create',
  created: 1625097600,
} as Stripe.Invoice;

describe('Invoice', () => {
  let service: InvoiceService;
  let invoiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            handleInvoiceFailed: jest.fn(),
            handleInvoicePaid: jest.fn(),
            createInvoice: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get(getRepositoryToken(Invoice));
  });

  it('creates an invoice on subscription creation', async () => {
    const invoiceData: Partial<Invoice> = {
      stripeInvoiceId: stripeInvoice.id,
      amountDue: stripeInvoice.amount_due,
      amountPaid: stripeInvoice.amount_paid,
      currency: stripeInvoice.currency.toUpperCase(),
      status: InvoiceStatus.open,
      billingReason: stripeInvoice.billing_reason,
      paidAt: stripeInvoice.status === 'paid' ? new Date() : null,
      createdAt: new Date(stripeInvoice.created * 1000),
    };

    invoiceRepository.create.mockReturnValue(invoiceData);
    invoiceRepository.save.mockResolvedValue(invoiceData);

    await service.createInvoice(stripeInvoice);

    expect(invoiceRepository.create).toHaveBeenCalledWith(invoiceData);
    expect(invoiceRepository.save).toHaveBeenCalledWith(invoiceData);
  });

  it('updates an invoice when payment is complete', async () => {
    const existingInvoice: Partial<Invoice> = {
      id: 1,
      stripeInvoiceId: stripeInvoice.id,
      amountDue: stripeInvoice.amount_due,
      amountPaid: stripeInvoice.amount_paid,
      currency: stripeInvoice.currency.toUpperCase(),
      status: InvoiceStatus.open,
      billingReason: stripeInvoice.billing_reason,
      paidAt: new Date(),
      createdAt: new Date(stripeInvoice.created * 1000),
    };
    invoiceRepository.findOne.mockResolvedValue(existingInvoice);
    invoiceRepository.save.mockResolvedValue(existingInvoice);

    await service.handleUpdateInvoice({
      ...stripeInvoice,
      status: InvoiceStatus.paid,
    });

    expect(invoiceRepository.save).toHaveBeenCalledWith({
      ...existingInvoice,
      status: InvoiceStatus.paid,
      updatedAt: expect.any(Date),
      dueDate: expect.any(Date),
    });
  });
});
