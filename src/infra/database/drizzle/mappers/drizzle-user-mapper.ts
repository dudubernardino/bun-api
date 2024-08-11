import { User } from '@/domain/users/entities/user'
import type { InferSelectModel } from 'drizzle-orm'

import { users } from '../schema'

type DrizzleUser = InferSelectModel<typeof users>

export class DrizzleUserMapper {
  static toDomain(payload: DrizzleUser): User {
    return User.create(
      {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        password: payload.password,
        createdAt: payload.createdAt ?? new Date(),
        updatedAt: payload.updatedAt,
      },
      payload.id,
    )
  }

  static toDrizzle(payload: User): DrizzleUser {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    }
  }
}
