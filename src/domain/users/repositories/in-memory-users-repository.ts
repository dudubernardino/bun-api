import type { User } from '../entities/user'
import type { UpdateUserDto, UsersRepository } from './users-repository'

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

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) return null

    return user
  }

  async findMany(): Promise<User[] | []> {
    return this.items
  }

  async update(id: string, payload: UpdateUserDto): Promise<User | null> {
    const user = this.items.findIndex((item) => item.id === id)

    if (user < 0) return null

    this.items[user] = { ...this.items[user], ...payload } as User

    return this.items[user]
  }
}
