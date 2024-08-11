import type { UserRole } from '@/infra/database/drizzle'
import type { User } from '../entities/user'

export type FindManyFilters = {
  id?: string
  name?: string
  email?: string
  role?: UserRole
}

export interface UsersRepository {
  create(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findMany(filters?: FindManyFilters): Promise<User[] | []>
}
