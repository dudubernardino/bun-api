import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { enumToPgEnum } from '../utils'

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export const userRoleEnum = pgEnum('user_role', enumToPgEnum(UserRole))

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: userRoleEnum('role').default(UserRole.MANAGER).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
})
