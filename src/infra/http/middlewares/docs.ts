import swagger from '@elysiajs/swagger'
import Elysia from 'elysia'

export const docs = new Elysia({ name: 'swagger' }).use(
  swagger({
    path: '/docs',
    documentation: {
      info: {
        title: '🦊 Bun API',
        version: '0.0.1',
      },
      tags: [{ name: 'Auth' }, { name: 'Users' }],
      components: {
        securitySchemes: {
          CookieAuth: {
            type: 'apiKey',
            name: 'auth',
            in: 'cookie',
            description: 'Authorization cookie token',
          },
        },
      },
    },
  }),
)
