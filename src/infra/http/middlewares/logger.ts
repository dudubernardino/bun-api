import { env } from '@/infra/env'
import Elysia from 'elysia'
import { pino } from 'pino'

export const logger = new Elysia({ name: 'logger' })
  .derive({ as: 'global' }, () => {
    const logger = new Logger()
    return { logger }
  })
  .onBeforeHandle({ as: 'global' }, ({ request, logger }) =>
    logger.verbose(`request received [${request.method}] ${request.url}`),
  )
  .onAfterResponse({ as: 'global' }, ({ request, set, logger, store }) => {
    const { status } = set

    // @ts-expect-error assign store object property
    if (store.hasError) {
      logger.error(`request errored with status code: ${status}`)
    }

    logger.verbose(
      `request completed [${request.method}] ${request.url} with status ${status}`,
    )
  })

export class Logger {
  private readonly logger

  private readonly defaultLoggerProperties = {
    level: env.LOG_LEVEL ?? 'verbose',
    customLevels: {
      verbose: 0,
    },
    nestedKey: 'payload',
  }

  private REDACTED_FIELDS = [
    'req.headers.authorization',
    '*.headers.authorization',
    'req.headers.cookie',
    'req.body.password',
  ]

  constructor() {
    this.logger = env.IS_LOCAL
      ? pino({
          transport: {
            target: 'pino-pretty',
            options: { singleLine: true },
          },
          ...this.defaultLoggerProperties,
        })
      : pino({
          ...this.defaultLoggerProperties,
          redact: this.REDACTED_FIELDS,
        })
  }

  verbose(value: unknown, message?: string) {
    this.logger.debug(value, message)
  }

  log(value: unknown, message?: string) {
    this.logger.info(value, message)
  }

  error(value: unknown, message?: string) {
    this.logger.error(value, message)
  }
}
