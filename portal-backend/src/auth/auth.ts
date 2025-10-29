import { stripe } from '@better-auth/stripe';
import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { admin as adminPlugin } from 'better-auth/plugins/admin';
import Stripe from 'stripe';
import { AppDataSource } from '../../sql/data-source';
import { BetterAuthLoggerPlugin } from '../logger/services/log-plugin';
import { ac, roles } from '../permissions/permissions';
import { loadTemplate } from '../utils/services/load-template-config';
import { sendEmail } from '../utils/services/transporter';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover', // Latest API version as of Stripe SDK v19
});

const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.DOMAIN;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;

const trustedOrigins = [FRONTEND_URL, BACKEND_URL, BETTER_AUTH_URL].filter(
  (url): url is string => !!url && /^https?:\/\//.test(url),
);

AppDataSource.initialize();
export const auth = betterAuth({
  url: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: typeormAdapter(AppDataSource),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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
  plugins: [
    openAPI(),
    BetterAuthLoggerPlugin(),
    adminPlugin({
      ac,
      roles: { admin: roles.admin, user: roles.user, pro: roles.pro },
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      // onCustomerCreate: async ({ customer, stripeCustomer, user }, request) => {
      //   // Do something with the newly created customer
      //   console.log(`Customer ${customer.id} created for user ${user.id}`);
      // },
      getCustomerCreateParams: async ({ user }) => ({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      }),
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
            name: 'PRO',
            priceId: 'price_H5UU2',
            freeTrial: {
              days: 14,
            },
          },
        ], // Define subscription plans here if needed
        requireEmailVerification: true,
        onSubscriptionCreated: async ({ subscription, user }) => {
          const html = await loadTemplate('subscription-created.template.html', {
            emailAddress: user.email,
            url: '',
          });
          // Update user role based on plan
          await auth.api.setRole({
            body: {
              userId: user.id,
              role: subscription.plan, // "basic", "premium", or "enterprise"
            },
            headers: {},
          });
          await sendEmail(user.email, 'Subscription Created', html);
        },

        onSubscriptionUpdated: async ({ subscription, user }) => {
          console.log(`Subscription updated for ${user.email}: ${subscription.plan}`);

          // Update user role when plan changes
          await auth.api.setRole({
            body: {
              userId: user.id,
              role: subscription.plan,
            },
            headers: {},
          });
        },

        onSubscriptionCanceled: async ({ subscription, user }) => {
          const html = await loadTemplate('subscription-cancelled.template.html', {
            emailAddress: user.email,
            url: '',
          });

          // Downgrade to free tier
          await auth.api.setRole({
            body: {
              userId: user.id,
              role: 'user',
            },
            headers: {},
          });
          await sendEmail(user.email, 'Subscription Cancelled', html);
        },
      },
      onEvent: async (event) => {
        console.log(`Stripe event: ${event.type}`);

        // Handle custom events if needed
        if (event.type === 'invoice.payment_failed') {
          // Send payment failed notification
          console.log('Payment failed:', event.data.object);
        }
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (process.env.ADMIN_EMAILS?.split(',').includes(user.email)) {
            return { data: { ...user, role: 'admin' } };
          }
          return { data: user };
        },
      },
    },
  },
});

export const initializeAuth = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};
