import { makeAuthenticateUserUseCase } from '@/infra/factories/users/make-authenticate-user'
import { eres } from '@/libs/utils'
import Elysia, { t } from 'elysia'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { auth } from '../middlewares/auth'
import { logger } from '../middlewares/logger'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(logger)
  .use(auth)
  .post(
    '/',
    async ({ body, signUser, logger, set }) => {
      const { email, password } = body

      const authenticateUserUseCase = makeAuthenticateUserUseCase()

      const [error, user] = await eres(
        authenticateUserUseCase.execute({ email, password }),
      )

      if (error) {
        logger.error(
          { error: error?.message },
          `Something went wrong verifying user credentials - ${email}`,
        )
        set.status = 401
        throw new UnauthorizedError()
      }

      logger.log(`login email: ${email} is valid: true`)

      const token = await signUser({
        sub: user.id,
        name: user.name,
        role: user.role,
      })

      set.status = 201
      return { accessToken: token }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    },
  )
