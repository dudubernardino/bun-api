import { defineConfig } from 'drizzle-kit'
import { env } from './src/infra/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infra/database/drizzle/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
