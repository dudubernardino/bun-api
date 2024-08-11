import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { User } from '../entities/user'
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { GetUserByIdUseCase } from './get-user-by-id'

describe('GetUserByIdUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserByIdUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserByIdUseCase(usersRepository)
  })

  it('should throw an error if fails', async () => {
    spyOn(usersRepository, 'findById').mockRejectedValueOnce(new Error())
    expect(sut.execute({ id: 'id' })).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw an error if does not find a user', async () => {
    expect(sut.execute({ id: 'id' })).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should get user by id', async () => {
    await usersRepository.create({
      id: 'userId',
      name: 'userName',
      email: 'user@email.com',
      password: 'secret',
      role: 'MANAGER',
    } as User)

    const result = await sut.execute({ id: 'userId' })

    expect(result).toEqual(
      expect.objectContaining({
        id: 'userId',
        name: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
      }),
    )
  })
})
