import { z } from 'zod';

export const AuthSchema = z.object({
    userEmail: z.string(),
    userPassword: z.string(),
});

export const RefreshSchema = z.object({
    userId: z.string(),
    token: z.string(),
});