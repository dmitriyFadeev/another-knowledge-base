import { z } from 'zod';

export const UserSchema = z.object({
    userLogin: z.string(),
    userPassword: z.string(),
    userEmail: z.string().email(),
});