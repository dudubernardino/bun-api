export class UnprocessableEntityError extends Error {
  constructor() {
    super('Something went wrong, we are looking into it.')
  }
}
