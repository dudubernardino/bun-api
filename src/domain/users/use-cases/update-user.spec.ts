import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import type { User } from '../entities/user'
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository'
import { UpdateUserError } from './errors/update-user-error'
import { UpdateUserUseCase } from './update-user'

describe('UpdateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: UpdateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should throw an error if fails to update user', async () => {
    spyOn(usersRepository, 'update').mockRejectedValueOnce(new Error())
    expect(
      sut.execute({ id: 'id', body: { name: 'updatedName' } }),
    ).rejects.toBeInstanceOf(UpdateUserError)
  })

  it('should update the user', async () => {
    await usersRepository.create({
      id: 'userId',
      name: 'userName',
      email: 'user@email.com',
      password: 'secret',
      role: 'MANAGER',
    } as User)

    const result = await sut.execute({
      id: 'userId',
      body: { name: 'updatedName' },
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: 'userId',
        name: 'updatedName',
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
      }),
    )
  })
})
