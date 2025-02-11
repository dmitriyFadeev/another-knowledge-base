import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    JWT_SECRET: z.string().default('default'),
    DB_URL: z.string().default('postgresql://postgres:password@localhost:5432/knowledge'),
    ALGORITHM: z.string().default('aes-256-cbc'),
    KEY: z.string().default('022d13ff3f9d89331056e2b441d18cbb76f2d509139e8f78d7b67e2fe7488de5'),
    IV: z.string().default('322a66c1afcaabe5a6e01c7e32881e31'),
    PORT: z.number().default(3000)
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
