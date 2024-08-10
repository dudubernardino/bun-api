/* eslint-disable no-console */
import { Elysia } from 'elysia'
import { env } from '../env'
import { UnauthorizedError } from './errors/unauthorized-error'
import { authRoutes, userRoutes } from './routes'

const app = new Elysia()
  // TODO: create a validation-handler
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ code, error, set, store }) => {
    switch (code) {
      case 'UNAUTHORIZED': {
        set.status = 401
        // @ts-expect-error assign store object property
        store.hasError = true
        return { code, message: error.message }
      }
      case 'VALIDATION': {
        set.status = 400
        // @ts-expect-error assign store object property
        store.hasError = true
        return { error: error.all }
      }
      default: {
        set.status = 500
        return new Response(null, { status: 500 })
      }
    }
  })
  .use(authRoutes)
  .use(userRoutes)

app.listen(env.PORT, () =>
  console.log(
    `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
  ),
)
