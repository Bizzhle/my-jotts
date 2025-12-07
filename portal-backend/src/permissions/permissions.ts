// permissions.ts
import { createAccessControl } from 'better-auth/plugins/access';

const statement = {
  // User management (from Better Auth admin plugin)
  user: ['create', 'list', 'update', 'delete', 'ban', 'set-role'],
  session: ['list', 'revoke', 'delete'],

  // Application-specific resources
  category: ['create', 'read', 'update', 'delete'],
  activity: ['create', 'read', 'update', 'delete'],
  image: ['upload', 'delete'],
  subscription: ['view', 'manage', 'upgrade', 'cancel'],
} as const;

export const ac = createAccessControl(statement);

// define roles
export const roles = {
  user: ac.newRole({
    category: ['read', 'create', 'delete', 'update'], // users can only read categories
    activity: ['read', 'create', 'delete', 'update'], // maybe create own activities
  }),

  pro: ac.newRole({
    category: ['create', 'read', 'update', 'delete'],
    activity: ['create', 'read', 'update', 'delete'],
    subscription: ['view', 'manage', 'upgrade', 'cancel'],
  }),

  admin: ac.newRole({
    user: ['create', 'list', 'update', 'delete', 'ban', 'set-role'],
    session: ['list', 'revoke', 'delete'],
    category: ['create', 'read', 'update', 'delete'],
    activity: ['create', 'read', 'update', 'delete'],
    image: ['upload', 'delete'],
    subscription: ['view', 'manage', 'upgrade', 'cancel'],
  }),

  // Add a new role for users who can bypass subscription requirements
  customUser: ac.newRole({
    // subscription: ['view', 'manage', 'upgrade', 'cancel'], // Allow subscription-related tasks
    category: ['create', 'read', 'update', 'delete'],
    activity: ['create', 'read', 'update', 'delete'],
  }),
};
