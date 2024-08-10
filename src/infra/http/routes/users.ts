import { makeGetUserByIdUseCase } from '@/infra/factories/users'
import Elysia, { t } from 'elysia'
import { auth } from '../middlewares/auth'
import { UserPresenter } from '../presenters/user-presenter'

export const userRoutes = new Elysia({ prefix: '/users' })
  .use(auth)
  .get('/me', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const getUserByIdUserCase = makeGetUserByIdUseCase()

    const result = await getUserByIdUserCase.execute({ id: userId })

    return UserPresenter.toHTTP(result)
  })
  .get(
    '/:id',
    async ({ params: { id } }) => {
      const getUserByIdUserCase = makeGetUserByIdUseCase()

      const result = await getUserByIdUserCase.execute({ id })

      return UserPresenter.toHTTP(result)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
