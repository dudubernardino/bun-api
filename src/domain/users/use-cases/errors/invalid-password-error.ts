export class InvalidPasswordError extends Error {
  constructor() {
    super('Something went wrong when verifying credentials.')
  }
}
