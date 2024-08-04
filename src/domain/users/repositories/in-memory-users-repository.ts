import type { User } from '../entities/user'
import type { UsersRepository } from './users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) return null

    return user
  }
}
