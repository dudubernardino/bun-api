export class EresError extends Error {
  [key: string]: unknown
}

export async function eres<T, E = EresError>(
  promise: Promise<T>,
): Promise<[null, T] | [E]> {
  return promise
    .then((result: T): [null, T] => [null, result])
    .catch((err) => [err as E])
}
