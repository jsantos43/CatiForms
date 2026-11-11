import crypto from 'node:crypto';
import { env } from '../config/env.js';

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const generateRandomToken = () => crypto.randomBytes(64).toString('hex');

// ISO 8601 (formato do campo no banco).
const refreshExpiresAt = () => new Date(Date.now() + env.refreshTokenTtl * 1000).toISOString();

const compareToken = (token: unknown, storedHash: unknown) => {
  if (typeof token !== 'string' || typeof storedHash !== 'string') return false;

  const hashed = hashToken(token);
  if (hashed.length !== storedHash.length) return false;

  return crypto.timingSafeEqual(Buffer.from(hashed), Buffer.from(storedHash));
};

export { hashToken, generateRandomToken, refreshExpiresAt, compareToken };
