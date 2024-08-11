import type { User } from '../entities/user'
import type {
  FindManyFilters,
  UsersRepository,
} from '../repositories/users-repository'

export class GetUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(params?: FindManyFilters): Promise<User[]> {
    const users = await this.usersRepository.findMany(params)
    return users
  }
}
