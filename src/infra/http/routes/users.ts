import { UserRole } from '@/infra/database/drizzle'
import { makeGetUserByIdUseCase } from '@/infra/factories/users'
import { makeCreateUserUseCase } from '@/infra/factories/users/make-create-user'
import { eres } from '@/libs/utils'
import Elysia, { t } from 'elysia'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { UnprocessableEntityError } from '../errors/unprocessable-entity-error'
import { auth } from '../middlewares/auth'
import { UserPresenter } from '../presenters/user-presenter'

export const userRoutes = new Elysia({ prefix: '/users' })
  .use(auth)
  .get('/me', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const getUserByIdUserCase = makeGetUserByIdUseCase()

    const [error, result] = await eres(
      getUserByIdUserCase.execute({ id: userId }),
    )

    if (error) throw new UnauthorizedError()

    return UserPresenter.toHTTP(result)
  })
  .post(
    '/',
    async ({ body }) => {
      const createUserUseCase = makeCreateUserUseCase()

      const [error, result] = await eres(createUserUseCase.execute({ body }))

      if (error) throw new UnprocessableEntityError()

      return UserPresenter.toHTTP(result)
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        password: t.String({
          pattern:
            '/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])[ -~]{8,}$/',
          error:
            'password must contain at least one number, one lowercase letter, one uppercase letter, one special character ($, *, &, @, or #), and have a minimum length of 8 characters',
        }),
        role: t.Enum({ MANAGER: UserRole.MANAGER }),
      }),
    },
  )
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
