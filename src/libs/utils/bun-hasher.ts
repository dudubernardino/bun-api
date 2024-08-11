export class BunHasher {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return Bun.password.hash(plain, {
      algorithm: 'bcrypt',
      cost: this.HASH_SALT_LENGTH,
    })
  }

  verify(plain: string, hash: string): Promise<boolean> {
    return Bun.password.verify(plain, hash)
  }
}
