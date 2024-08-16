/* eslint-disable no-console */

import { afterAll, beforeAll } from 'bun:test'
import chalk from 'chalk'
import { randomUUID } from 'crypto'
import { sql } from 'drizzle-orm'
import { db } from './database/drizzle'
import { env } from './env'

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

async function executeMigration() {
  const { stdout, stderr } = Bun.spawn(['bun', 'db:migrate'])
  const stdoutStr = await new Response(stdout).text()

  console.log('STDOUT:', stdoutStr)

  // if (!success) {
  //   console.log(chalk.red(`✗ DB ${schemaId} failed to migrate!`))
  //   throw new Error('Failed to migrate the database')
  // }

  console.log(chalk.yellow(`✓ DB ${schemaId} migrated!`))
}

beforeAll(async () => {
  await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaId}"`))

  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  await executeMigration()
})

afterAll(async () => {
  await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`))
  console.log(chalk.yellow(`✓ DB ${schemaId} dropped!`))
})
