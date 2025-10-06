import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export type Session = typeof authClient.$Infer.Session;

export type ExtendedUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  phone?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
