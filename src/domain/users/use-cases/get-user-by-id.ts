import { eres } from '@/libs/utils'
import type { User } from '../entities/user'
import type { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

type Request = {
  userId: string
}

export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(params: Request): Promise<User> {
    const { userId } = params

    const [error, user] = await eres(this.usersRepository.findById(userId))

    if (error || !user) throw new UserNotFoundError()

    return user
  }
}
