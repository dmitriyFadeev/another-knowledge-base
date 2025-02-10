import { bigserial, pgTable, text } from "drizzle-orm/pg-core";

export const pgUsersSchema = pgTable('users', {
    userId: bigserial('user_id', { mode: 'bigint' }).primaryKey(),
    userLogin: text('user_login').notNull().unique(),
    userPassword: text('user_password').notNull(),
    userEmail: text('user_email').notNull().unique(),
    userRefreshToken: text('user_refresh_token'),
});