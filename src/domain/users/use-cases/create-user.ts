import type { UserRole } from '@/infra/database/drizzle'
import { BunHasher, eres } from '@/libs/utils'
import { User } from '../entities/user'
import type { UsersRepository } from '../repositories/users-repository'
import { CreateUserError } from './errors/create-user-error'
import { UserAlreadyExistsError } from './errors/user-already-exists'

type Request = {
  body: {
    name: string
    email: string
    password: string
    role: UserRole
  }
}

export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: Request): Promise<User> {
    const { name, email, password, role } = request.body

    const [error, userAlreadyExists] = await eres(
      this.usersRepository.findByEmail(email),
    )
    if (error || userAlreadyExists) throw new UserAlreadyExistsError()

    const hasher = new BunHasher()
    const hashedPassword = await hasher.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role,
      updatedAt: null,
    })

    const [createUserError] = await eres(this.usersRepository.create(user))
    if (createUserError) throw new CreateUserError()

    return user
  }
}
