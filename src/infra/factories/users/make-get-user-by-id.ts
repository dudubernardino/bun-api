import { GetUserByIdUseCase } from '@/domain/users/use-cases/get-user-by-id'
import { DrizzleUsersRepository } from '../../database/drizzle'

export function makeGetUserByIdUseCase() {
  const usersRepository = new DrizzleUsersRepository()

  return new GetUserByIdUseCase(usersRepository)
}
