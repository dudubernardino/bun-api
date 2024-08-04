import type { User } from '@/domain/users/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ? user.updatedAt : undefined,
    }
  }
}
