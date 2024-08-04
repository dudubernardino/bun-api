import { makeGetUserByIdUseCase } from '@/infra/factories'
import { UserPresenter } from '../../presenters'

export async function findById(userId: string) {
  const getUserByIdUserCase = makeGetUserByIdUseCase()

  const result = await getUserByIdUserCase.execute({ userId })

  return UserPresenter.toHTTP(result)
}
