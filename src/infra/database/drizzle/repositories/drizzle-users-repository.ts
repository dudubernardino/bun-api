import type { User } from '@/domain/users/entities/user'
import type {
  FindManyFilters,
  UsersRepository,
} from '@/domain/users/repositories/users-repository'

import { and, eq, ilike, type SQLWrapper } from 'drizzle-orm'
import { db } from '../connection'
import { DrizzleUserMapper } from '../mappers/drizzle-user-mapper'
import { users } from '../schema'

export class DrizzleUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    const newUser = DrizzleUserMapper.toDrizzle(user)
    const [result] = await db.insert(users).values(newUser).returning()

    return DrizzleUserMapper.toDomain(result)
  }

  async findById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, id)
      },
    })

    if (!user) return null

    return DrizzleUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!user) return null

    return DrizzleUserMapper.toDomain(user)
  }

  async findMany(filters?: FindManyFilters): Promise<User[] | []> {
    const filter: SQLWrapper[] = []

    if (filters?.id) {
      filter.push(eq(users.id, filters.id))
    }

    if (filters?.name) {
      filter.push(ilike(users.name, `%${filters.name}%`))
    }

    if (filters?.email) {
      filter.push(ilike(users.email, `%${filters.email}%`))
    }

    if (filters?.role) {
      filter.push(eq(users.role, filters.role))
    }

    const result = await db.query.users.findMany({
      where: and(...filter),
    })

    return result.map((user) => DrizzleUserMapper.toDomain(user))
  }
}
