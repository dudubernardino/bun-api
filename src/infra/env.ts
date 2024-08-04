import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_USER: z.string().default('docker_user'),
  DATABASE_PASSWORD: z.string().default('docker_password'),
  DATABASE_PORT: z.coerce.number().default(5432),
})

export const env = envSchema.parse(process.env)
