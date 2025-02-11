import { z } from 'zod';

export const UserSchema = z.object({
    userLogin: z.string().nonempty("Login is required"),
    userPassword: z.string().nonempty("Password is required"),
    userEmail: z.string().nonempty("Email is required"),
});