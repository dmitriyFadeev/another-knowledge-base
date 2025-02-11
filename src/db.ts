import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';

import { env } from './env.js';
const { Pool } = pkg;
const pool = new Pool({
  connectionString: `${env.DB_URL}`,
});

const db = drizzle(pool);

export default db;