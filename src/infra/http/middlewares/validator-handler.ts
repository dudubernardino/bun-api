import Elysia, { ValidationError } from 'elysia'
import { match } from 'ts-pattern'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { UnprocessableEntityError } from '../errors/unprocessable-entity-error'
import { UserNotFoundError } from '../errors/user-not-found'

const mapValidationError = (error: ValidationError) =>
  error.all.map((error) => {
    const path = error.path.replace('/', '')
    const message = error.schema.error || error.message

    return `${path} - ${message}`
  })

export const validatorHandler = new Elysia({ name: 'validator-hanlder' })
  .error({
    UNAUTHORIZED: UnauthorizedError,
    UNPROCESSABLE_ENTITY: UnprocessableEntityError,
    USER_NOT_FOUND: UserNotFoundError,
  })
  .onError({ as: 'global' }, ({ request, code, error, set, store }) => {
    return match({ request, code, error, set, store })
      .with({ code: 'UNAUTHORIZED' }, ({ request, set, store, error }) => {
        // @ts-expect-error assign store object property
        store.hasError = true

        return {
          code,
          message: [error.message],
          method: request.method,
          path: request.url,
          statusCode: set.status || 401,
          timestamp: new Date()?.toISOString(),
        }
      })
      .with(
        { code: 'UNPROCESSABLE_ENTITY' },
        ({ request, set, store, error }) => {
          // @ts-expect-error assign store object property
          store.hasError = true

          return {
            code,
            message: [error.message],
            method: request.method,
            path: request.url,
            statusCode: set.status || 422,
            timestamp: new Date()?.toISOString(),
          }
        },
      )
      .with({ code: 'USER_NOT_FOUND' }, ({ request, set, store, error }) => {
        // @ts-expect-error assign store object property
        store.hasError = true

        return {
          code,
          message: [error.message],
          method: request.method,
          path: request.url,
          statusCode: set.status || 404,
          timestamp: new Date()?.toISOString(),
        }
      })
      .with({ code: 'VALIDATION' }, ({ request, set, store, error }) => {
        // @ts-expect-error assign store object property
        store.hasError = true

        const parsedErrors = mapValidationError(error as ValidationError)

        return {
          code,
          message: parsedErrors,
          method: request.method,
          path: request.url,
          statusCode: set.status || 400,
          timestamp: new Date()?.toISOString(),
        }
      })
      .otherwise(() => {
        set.status = 500
        return new Response(null, { status: 500 })
      })
  })
