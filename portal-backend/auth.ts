import { stripe } from '@better-auth/stripe';
import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import { betterAuth } from 'better-auth';
import { admin as adminPlugin, openAPI } from 'better-auth/plugins';
import { Queue } from 'bullmq';
import Stripe from 'stripe';
import { AppDataSource } from './sql/data-source';
import { BetterAuthLoggerPlugin } from './src/logger/services/log-plugin';
import { ac, roles } from './src/permissions/permissions';
import {
  QueueName,
  SEND_PASSWORD_RESET,
  SEND_VERIFICATION_EMAIL,
} from './src/queue/constants/queue.constants';

const emailQueue = new Queue(QueueName.EMAIL, {
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  },
});

const trustedOrigins = [
  'http://localhost:5173',
  'https://myjotts.com',
  'https://www.myjotts.com',
  'https://api.myjotts.com',
  'https://myjotts.local',
];

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover', // Latest API version as of Stripe SDK v19
});

const mapSubscriptionPlanToRole = (plan: string): keyof typeof roles => {
  const normalizedPlan = plan.toLowerCase();
  if (normalizedPlan === 'pro') {
    return 'pro';
  }
  return 'user';
};

const setUserRole = async (userId: string | undefined, role: keyof typeof roles) => {
  if (!userId) {
    throw new Error('Stripe subscription is missing a referenceId');
  }

  await (auth.api as any).setRole({
    body: {
      userId,
      role,
    },
    headers: {},
  });
};

const mapStoredPlanToRole = (plan: string | null | undefined): keyof typeof roles => {
  return mapSubscriptionPlanToRole(plan ?? 'user');
};

export const auth = betterAuth({
  url: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: typeormAdapter(AppDataSource),
  advanced: {
    database: {
      generateId: 'uuid', // Keep IDs available in Better Auth before inserts for the TypeORM adapter
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
        required: true,
        defaultValue: 'user',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await emailQueue.add(
        SEND_PASSWORD_RESET,
        {
          to: user.email,
          resetLink: url,
        },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Send verification email on signup
    autoSignInAfterVerification: true, // Optional: auto sign-in after verification
    sendVerificationEmail: async ({ user, token }, request) => {
      const frontendUrl = process.env.FRONTEND_URL;
      const url = `${frontendUrl}/verify-email?token=${token}`;
      await emailQueue.add(
        SEND_VERIFICATION_EMAIL,
        { to: user.email, url },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      );
    },
  },
  trustedOrigins,
  basePath: '/api/auth',
  exposeRoutes: false,
  plugins: [
    openAPI(),
    BetterAuthLoggerPlugin(),
    adminPlugin({
      ac,
      roles: { admin: roles.admin, user: roles.user, customUser: roles.customUser }, // Corrected the role name to match the `roles` object
      defaultRole: 'user',
      adminRoles: ['admin'],
    }) as any,
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      // onCustomerCreate: async ({ customer, stripeCustomer, user }, request) => {
      //   // Do something with the newly created customer
      //   console.log(`Customer ${customer.id} created for user ${user.id}`);
      // },
      // getCustomerCreateParams: async ({ user }) => ({
      //   email: user.email,
      //   name: user.name,
      //   metadata: {
      //     userId: user.id,
      //   },
      // }),
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'basic',
            priceId: 'price_H5UU1',
            limits: {
              activities: 10,
              categories: 10,
            },
          },
          {
            name: 'pro',
            priceId: 'price_H5UU2',
            freeTrial: {
              days: 14,
            },
          },
        ], // Define subscription plans here if needed
        requireEmailVerification: true,
        onSubscriptionCreated: async ({ subscription, plan }) => {
          await setUserRole(subscription.referenceId, mapSubscriptionPlanToRole(plan.name));
        },
        onSubscriptionUpdate: async ({ subscription }) => {
          await setUserRole(subscription.referenceId, mapStoredPlanToRole(subscription.plan));
        },
        onSubscriptionCancel: async ({ subscription }) => {
          await setUserRole(subscription.referenceId, 'user');
        },
        onSubscriptionDeleted: async ({ subscription }) => {
          await setUserRole(subscription.referenceId, 'user');
        },
      },
      onEvent: async (event) => {
        // Handle custom events if needed
        if (event.type === 'invoice.payment_failed') {
          // Send payment failed notification
        }
      },
    }),
  ],
  databaseHooks: {},
  // middlewares: [betterAuthCorsMiddleware()],543
});

function betterAuthCorsMiddleware() {
  return async (request, ctx, next) => {
    const origin =
      typeof (request as any).headers?.get === 'function'
        ? (request as any).headers.get('origin')
        : (request as any).headers?.origin || undefined;

    if (typeof origin === 'string' && trustedOrigins.includes(origin)) {
      // Set CORS headers on ctx (BetterAuth context)
      ctx.setHeader?.('Access-Control-Allow-Origin', origin);
      ctx.setHeader?.('Access-Control-Allow-Credentials', 'true');
      ctx.setHeader?.(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      );
      ctx.setHeader?.('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      // Also set CORS headers on ctx.res (Node.js/Express response) if available
      if (ctx.res?.setHeader) {
        ctx.res.setHeader('Access-Control-Allow-Origin', origin);
        ctx.res.setHeader('Access-Control-Allow-Credentials', 'true');
        ctx.res.setHeader(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        );
        ctx.res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      }
    }

    if (request.method === 'OPTIONS') {
      ctx.status = 204;
      ctx.body = '';
      return;
    }

    await next();
  };
}
