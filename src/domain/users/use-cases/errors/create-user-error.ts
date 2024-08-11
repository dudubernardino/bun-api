export class CreateUserError extends Error {
  constructor() {
    super('Something went wrong whentrying to create the user.')
  }
}
