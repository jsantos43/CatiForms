import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const hash = (value: string) => bcrypt.hash(value, SALT_ROUNDS);

const compareHash = (value: string, hashed: string) => bcrypt.compare(value, hashed);

export { hash, compareHash };
