import { eres } from '@/libs/utils'
import type { User } from '../entities/user'
import type {
  UpdateUserDto,
  UsersRepository,
} from '../repositories/users-repository'
import { UpdateUserError } from './errors/update-user-error'

type Request = {
  id: string
  body: UpdateUserDto
}

export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(params: Request): Promise<User> {
    const { id, body } = params

    const [updateUserError, updatedUser] = await eres(
      this.usersRepository.update(id, body),
    )

    if (updateUserError || !updatedUser) throw new UpdateUserError()

    return updatedUser
  }
}
