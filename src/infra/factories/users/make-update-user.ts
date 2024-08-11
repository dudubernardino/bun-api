import { UpdateUserUseCase } from '@/domain/users/use-cases/update-user'
import { DrizzleUsersRepository } from '@/infra/database/drizzle/repositories/drizzle-users-repository'

export function makeUpdateUserUseCase() {
  const usersRepository = new DrizzleUsersRepository()

  return new UpdateUserUseCase(usersRepository)
}
