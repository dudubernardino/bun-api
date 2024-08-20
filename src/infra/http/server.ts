/* eslint-disable no-console */
import { Elysia } from 'elysia'
import { env } from '../env'
import { docs } from './middlewares/docs'
import { validatorHandler } from './middlewares/validator-handler'
import { authRoutes, userRoutes } from './routes'

const app = new Elysia()
  .use(docs)
  .use(validatorHandler)
  .use(authRoutes)
  .use(userRoutes)

app.listen(env.PORT || 3000, () =>
  console.log(
    `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
  ),
)

export { app }
