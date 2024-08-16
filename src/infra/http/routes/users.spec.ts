import { beforeAll, describe, expect, it } from 'bun:test'
import { app } from '../server'

describe('Users (e2e)', () => {
  let accessToken = ''

  beforeAll(async () => {
    const request = await app.handle(
      new Request('http://localhost/auth', {
        method: 'POST',
        body: JSON.stringify({
          email: 'eduardomoura.moura@gmail.com',
          password: 'secret',
        }),
        headers: {
          'content-type': 'application/json',
        },
      }),
    )

    const result = await request.json()

    accessToken = result.accessToken
  })

  it('(GET) /users', async () => {
    const request = await app.handle(
      new Request('http://localhost/users', {
        headers: { Cookie: `auth=${accessToken}` },
      }),
    )
    const result = await request.json()

    expect(request.status).toBe(200)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    )
  })
})
