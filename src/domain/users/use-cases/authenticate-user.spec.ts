import { BunHasher } from '@/libs/utils'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import type { User } from '../entities/user'
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { InvalidPasswordError } from './errors/invalid-password-error'
import { UserNotFoundError } from './errors/user-not-found-error'

describe('AuthenticateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(usersRepository)
  })

  const body = {
    email: 'email@email.com.br',
    password: 'password',
  }

  it('should throw an error if fails', async () => {
    spyOn(usersRepository, 'findByEmail').mockRejectedValueOnce(new Error())
    expect(sut.execute(body)).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw an error if does not find a user', async () => {
    expect(sut.execute(body)).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw an error if password mismatch', async () => {
    const hashedSecret = await new BunHasher().hash('secret')
    const user = await usersRepository.create({
      id: 'userId',
      name: 'userName',
      email: 'user@email.com',
      password: hashedSecret,
      role: 'MANAGER',
    } as User)

    expect(
      sut.execute({ email: user.email, password: 'invalid_secret' }),
    ).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('should authenticate user', async () => {
    const hashedSecret = await new BunHasher().hash('secret')
    const user = await usersRepository.create({
      id: 'userId',
      name: 'userName',
      email: 'user@email.com',
      password: hashedSecret,
      role: 'MANAGER',
    } as User)

    const result = await sut.execute({
      email: user.email,
      password: 'secret',
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: user.name,
        email: user.email,
        password: expect.any(String),
        role: user.role,
      }),
    )
  })
})
