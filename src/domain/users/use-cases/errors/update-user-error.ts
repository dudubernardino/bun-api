export class UpdateUserError extends Error {
  constructor() {
    super('Something went wrong when trying to update the user.')
  }
}
