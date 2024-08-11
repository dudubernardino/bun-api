import { BunHasher, eres } from '@/libs/utils'
import type { User } from '../entities/user'
import type { UsersRepository } from '../repositories/users-repository'
import { InvalidPasswordError } from './errors/invalid-password-error'
import { UserNotFoundError } from './errors/user-not-found-error'

type Request = {
  email: string
  password: string
}

export class AuthenticateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: Request): Promise<User> {
    const { email, password } = request

    const [error, user] = await eres(this.usersRepository.findByEmail(email))
    if (error || !user) throw new UserNotFoundError()

    const hasher = new BunHasher()

    const isValidPassword = await hasher.verify(password, user.password)
    if (!isValidPassword) throw new InvalidPasswordError()

    return user
  }
}
