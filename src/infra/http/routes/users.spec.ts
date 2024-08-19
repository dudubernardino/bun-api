import { db, UserRole, users } from '@/infra/database/drizzle'
import { beforeAll, describe, expect, it } from 'bun:test'
import { randomBytes } from 'crypto'
import { app } from '../server'

describe('Users (e2e)', () => {
  let accessToken = ''

  beforeAll(async () => {
    const request = await app.handle(
      new Request('http://localhost/auth', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@admin.com',
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

  describe('(POST) /users', () => {
    it('should not create an user if already exists', async () => {
      const request = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          body: JSON.stringify({
            name: 'user',
            email: 'admin@admin.com',
            password: 'PXr8@GEeoyDQGV9',
            role: 'MANAGER',
          }),
          headers: {
            'content-type': 'application/json',
          },
        }),
      )
      const result = await request.json()

      expect(request.status).toBe(422)
      expect(result).toEqual(
        expect.objectContaining({
          code: 'UNPROCESSABLE_ENTITY',
          message: expect.any(Array),
          method: expect.any(String),
          path: expect.any(String),
          statusCode: 422,
          timestamp: expect.any(String),
        }),
      )
    })

    it('should create an user', async () => {
      const body = {
        name: 'user',
        email: `${randomBytes(10).toString('hex')}@email.com`,
        password: 'PXr8@GEeoyDQGV9',
        role: 'MANAGER',
      }

      const request = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }),
      )
      const result = await request.json()

      expect(request.status).toBe(201)
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: body.name,
          email: body.email,
          role: body.role,
          createdAt: expect.any(String),
        }),
      )
    })
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

  describe('(GET) /users/:id', () => {
    it('should throw an error if not found', async () => {
      const request = await app.handle(
        new Request('http://localhost/users/id', {
          headers: { Cookie: `auth=${accessToken}` },
        }),
      )
      const result = await request.json()

      expect(request.status).toBe(404)
      expect(result).toEqual(
        expect.objectContaining({
          code: 'USER_NOT_FOUND',
          message: expect.any(Array),
          method: expect.any(String),
          path: expect.any(String),
          statusCode: 404,
          timestamp: expect.any(String),
        }),
      )
    })

    it('should return an user', async () => {
      const [user] = await db
        .insert(users)
        .values({
          name: 'user',
          email: `${randomBytes(10).toString('hex')}@email.com`,
          password: 'PXr8@GEeoyDQGV9',
          role: UserRole.MANAGER,
        })
        .returning({ id: users.id })

      const request = await app.handle(
        new Request(`http://localhost/users/${user.id}`, {
          headers: { Cookie: `auth=${accessToken}` },
        }),
      )
      const result = await request.json()

      expect(request.status).toBe(200)
      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          name: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(String),
        }),
      )
    })
  })

  it('(PATCH) /users/:id', async () => {
    const [user] = await db
      .insert(users)
      .values({
        name: 'user',
        email: `${randomBytes(10).toString('hex')}@email.com`,
        password: 'PXr8@GEeoyDQGV9',
        role: UserRole.MANAGER,
      })
      .returning({ id: users.id })

    const body = {
      name: 'new user name',
    }

    const request = await app.handle(
      new Request(`http://localhost/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          Cookie: `auth=${accessToken}`,
          'content-type': 'application/json',
        },
      }),
    )
    const result = await request.json()

    expect(request.status).toBe(200)
    expect(result).toEqual(
      expect.objectContaining({
        id: user.id,
        name: body.name,
        email: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    )
  })

  it('(GET) /users/me', async () => {
    const request = await app.handle(
      new Request('http://localhost/users/me', {
        headers: { Cookie: `auth=${accessToken}` },
      }),
    )
    const result = await request.json()

    expect(request.status).toBe(200)
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(String),
      }),
    )
  })
})
