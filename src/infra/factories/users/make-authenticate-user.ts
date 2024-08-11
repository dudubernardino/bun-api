import { AuthenticateUserUseCase } from '@/domain/users/use-cases/authenticate-user'
import { DrizzleUsersRepository } from '@/infra/database/drizzle/repositories/drizzle-users-repository'

export function makeAuthenticateUserUseCase() {
  const usersRepository = new DrizzleUsersRepository()

  return new AuthenticateUserUseCase(usersRepository)
}
