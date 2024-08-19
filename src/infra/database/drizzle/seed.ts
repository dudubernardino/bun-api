/* eslint-disable drizzle/enforce-delete-with-where */
/* eslint-disable no-console */

import { BunHasher } from '@/libs/utils'
import { fakerPT_BR as faker } from '@faker-js/faker'
import chalk from 'chalk'
import { db } from './connection'
import { UserRole, users } from './schema'

async function resetDatabase() {
  await db.delete(users)

  console.log(chalk.yellow('✓ Database reset!'))
}

async function hashPassword(password: string) {
  const hasher = new BunHasher()
  const hashedPassword = await hasher.hash(password)
  return hashedPassword
}

async function createUsers() {
  const password = await hashPassword('secret')

  const [userAdmin, userManager] = await db
    .insert(users)
    .values([
      {
        name: faker.person.fullName(),
        email: 'admin@admin.com',
        password,
        role: UserRole.ADMIN,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password,
        role: UserRole.ADMIN,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password,
        role: UserRole.MANAGER,
      },
    ])
    .returning()

  console.log(chalk.yellow('✓ Created users!'))

  return [userAdmin, userManager]
}

try {
  await resetDatabase()

  await createUsers()

  console.log(chalk.green('✓ Database seeded successfully!'))
} catch (error) {
  await resetDatabase()
  console.log(chalk.red('✗ Database seeding failed!'))
} finally {
  process.exit()
}
