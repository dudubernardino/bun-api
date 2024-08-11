import { UserRole } from '@/infra/database/drizzle'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import type { User } from '../entities/user'
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { CreateUserError } from './errors/create-user-error'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('CreateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: CreateUserUseCase

  const body = {
    name: 'userName',
    email: 'user@email.com',
    password: 'secret',
    role: UserRole.MANAGER,
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)
  })

  it('should throw an error if user does not exist', async () => {
    await usersRepository.create({
      id: 'userId',
      name: 'userName',
      email: 'user@email.com',
      password: 'secret',
    } as User)

    expect(sut.execute({ body })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should throw an error if fails to create the user', async () => {
    // idk why it didn't work with `mockRejectedValueOnce`
    spyOn(usersRepository, 'create').mockImplementationOnce(async () => {
      throw new Error()
    })
    expect(sut.execute({ body })).rejects.toBeInstanceOf(CreateUserError)
  })

  it('should crate a user successfully', async () => {
    spyOn(usersRepository, 'findByEmail')
    spyOn(usersRepository, 'create')

    const result = await sut.execute({ body })

    expect(usersRepository.findByEmail).toBeCalledTimes(1)
    expect(usersRepository.create).toBeCalledTimes(1)
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: body.name,
        email: body.email,
        password: expect.any(String),
        role: body.role,
      }),
    )
  })
})
