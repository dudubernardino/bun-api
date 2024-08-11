import { UserRole } from '@/infra/database/drizzle'
import { makeGetUserByIdUseCase } from '@/infra/factories/users'
import { makeCreateUserUseCase } from '@/infra/factories/users/make-create-user'
import { makeGetUsersUseCase } from '@/infra/factories/users/make-get-users'
import { eres } from '@/libs/utils'
import Elysia, { t } from 'elysia'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { UnprocessableEntityError } from '../errors/unprocessable-entity-error'
import { UserNotFoundError } from '../errors/user-not-found'
import { auth } from '../middlewares/auth'
import { logger } from '../middlewares/logger'
import { UserPresenter } from '../presenters/user-presenter'

// TODO: block unauthenticated users
export const userRoutes = new Elysia({ prefix: '/users' })
  .use(logger)
  .use(auth)
  .get('/me', async ({ getCurrentUser, logger, set }) => {
    const { userId } = await getCurrentUser()

    const getUserByIdUserCase = makeGetUserByIdUseCase()

    const [error, result] = await eres(
      getUserByIdUserCase.execute({ id: userId }),
    )

    if (error) {
      logger.error(
        { error: error?.message },
        `Something went wrong verifying user credentials - ${userId}`,
      )
      set.status = 401
      throw new UnauthorizedError()
    }

    set.status = 200
    return UserPresenter.toHTTP(result)
  })
  .post(
    '/',
    async ({ body, logger, set }) => {
      const createUserUseCase = makeCreateUserUseCase()

      const [error, result] = await eres(createUserUseCase.execute({ body }))

      if (error) {
        logger.error(
          { body, error: error?.message },
          `Something went wrong when trying to create the user`,
        )
        set.status = 422
        throw new UnprocessableEntityError()
      }

      set.status = 201
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
    '/',
    async ({ query, logger, set }) => {
      const getUsersUseCase = makeGetUsersUseCase()

      const [error, result] = await eres(getUsersUseCase.execute(query))

      if (error) {
        logger.error(
          { error: error?.message },
          `Something went wrong when trying to get the users`,
        )

        set.status = 404
        throw new UserNotFoundError()
      }

      set.status = 200
      return result.map((user) => UserPresenter.toHTTP(user))
    },
    {
      query: t.Object({
        id: t.Optional(t.String()),
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
        role: t.Optional(t.Enum({ MANAGER: UserRole.MANAGER })),
      }),
    },
  )
  .get(
    '/:id',
    async ({ params: { id }, logger, set }) => {
      const getUserByIdUserCase = makeGetUserByIdUseCase()

      const [error, result] = await eres(getUserByIdUserCase.execute({ id }))

      if (error) {
        logger.error(
          { error: error?.message },
          `Something went wrong when trying to get the user - ${id}`,
        )
        set.status = 404
        throw new UserNotFoundError()
      }

      set.status = 200
      return UserPresenter.toHTTP(result)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
