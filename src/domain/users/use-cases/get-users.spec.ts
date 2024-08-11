import { beforeEach, describe, expect, it } from 'bun:test'
import type { User } from '../entities/user'
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository'
import { GetUsersUseCase } from './get-users'

describe('GetUsersUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUsersUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUsersUseCase(usersRepository)
  })

  it('should retrieve all users', async () => {
    await usersRepository.create({
      id: 'userId',
      name: 'userName',
      email: 'user@email.com',
      password: 'secret',
      role: 'MANAGER',
    } as User)

    const result = await sut.execute()

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
        }),
      ]),
    )
  })
})
