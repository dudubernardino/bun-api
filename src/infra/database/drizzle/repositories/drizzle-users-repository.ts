import type { User } from '@/domain/users/entities/user'
import type { UsersRepository } from '@/domain/users/repositories/users-repository'

import { db } from '../connection'
import { DrizzleUserMapper } from '../mappers'
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
}
