import { CreateUserUseCase } from '@/domain/users/use-cases/create-user'
import { DrizzleUsersRepository } from '@/infra/database/drizzle/repositories/drizzle-users-repository'

export function makeCreateUserUseCase() {
  const usersRepository = new DrizzleUsersRepository()

  return new CreateUserUseCase(usersRepository)
}
