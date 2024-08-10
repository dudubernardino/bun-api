import { eres } from '@/libs/utils'
import type { User } from '../entities/user'
import type { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

type Request = {
  email: string
  password: string
}

export class AuthenticateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(params: Request): Promise<User> {
    const { email } = params

    const [error, user] = await eres(this.usersRepository.findByEmail(email))

    if (error || !user) throw new UserNotFoundError()

    // TODO: verify password

    return user
  }
}
