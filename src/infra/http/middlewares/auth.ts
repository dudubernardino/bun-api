import jwt from '@elysiajs/jwt'
import Elysia, { t, type Static } from 'elysia'
import { importPKCS8, importSPKI } from 'jose'
import { env } from '../../env'
import { UnauthorizedError } from '../errors/unauthorized-error'

const jwtPayload = t.Object({
  sub: t.String(),
  name: t.String(),
  role: t.String(),
})

const publicKey = await importSPKI(env.JWT_PUBLIC_KEY, 'RS256')
const privateKey = await importPKCS8(env.JWT_PRIVATE_KEY, 'RS256')

export const auth = new Elysia()
  .use(
    jwt({
      privateKey,
      publicKey,
      alg: 'RS256',
      exp: '1d',
      schema: jwtPayload,
    }),
  )
  .derive({ as: 'global' }, ({ jwt, cookie: { auth }, set }) => {
    return {
      // TODO: sign with 2fa token
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload)

        auth.set({
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1, // 1 day
          path: '/',
          value: token,
        })

        return token
      },
      signOut: () => auth.remove(),
      getCurrentUser: async () => {
        const payload = await jwt.verify(auth.value)

        if (!payload) {
          set.status = 401
          throw new UnauthorizedError()
        }

        return {
          userId: payload.sub,
          name: payload.name,
          role: payload.role,
        }
      },
    }
  })
