import type { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import type { UserRole } from '@/infra/database/drizzle/schema'

export type UserProps = {
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date | null
}

export class User extends Entity<UserProps> {
  static create(props: Optional<UserProps, 'createdAt'>, id?: string): User {
    const user = new User(
      {
        createdAt: props.createdAt ?? new Date(),
        ...props,
      },
      id,
    )
    return user
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
