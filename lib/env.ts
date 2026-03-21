import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_SERVER_API_URL: z.url('NEXT_PUBLIC_SERVER_API_URL must be a valid URL'),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SERVER_API_URL: process.env.NEXT_PUBLIC_SERVER_API_URL,
});