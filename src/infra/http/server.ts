/* eslint-disable no-console */
import { Elysia } from 'elysia'
import { env } from '../env'
import { validatorHandler } from './middlewares/validator-handler'
import { authRoutes, userRoutes } from './routes'

// TODO: swagger docs
const app = new Elysia().use(validatorHandler).use(authRoutes).use(userRoutes)

app.listen(env.PORT, () =>
  console.log(
    `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
  ),
)
