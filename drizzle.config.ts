import { defineConfig } from 'drizzle-kit';

import { env } from './src/env';

const url = env.DB_URL;
if (!url) throw new Error('No url provided');

export default defineConfig({
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  schema: './src/drizzle/schema.ts',
  dbCredentials: {
    url,
  },
  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public',
  },
  strict: true,
  verbose: true,
});
