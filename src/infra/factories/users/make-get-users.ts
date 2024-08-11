import { GetUsersUseCase } from '@/domain/users/use-cases/get-users'
import { DrizzleUsersRepository } from '@/infra/database/drizzle/repositories/drizzle-users-repository'

export function makeGetUsersUseCase() {
  const usersRepository = new DrizzleUsersRepository()

  return new GetUsersUseCase(usersRepository)
}
