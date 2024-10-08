import { GetUserByIdUseCase } from '@/domain/users/use-cases/get-user-by-id'
import { DrizzleUsersRepository } from '@/infra/database/drizzle/repositories/drizzle-users-repository'

export function makeGetUserByIdUseCase() {
  const usersRepository = new DrizzleUsersRepository()

  return new GetUserByIdUseCase(usersRepository)
}
