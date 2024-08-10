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

      if (error || !user) {
        logger.error(`User does not exist - ${email}`)
        throw new UnauthorizedError()
      }

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
