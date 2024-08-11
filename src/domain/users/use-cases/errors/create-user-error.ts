export class CreateUserError extends Error {
  constructor() {
    super('Something went wrong when trying to create the user.')
  }
}
