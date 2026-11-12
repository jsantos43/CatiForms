import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthUser } from '../types/express.js';
import { Unauthorized } from '../errors/index.js';
import { accessTokenPayloadSchema, type AccessTokenPayload } from '../schemas/Auth.js';
import { db } from '../prisma/db.js';
import { compareHash, hash } from '../utils/hash.js';
import { generateRandomToken, hashToken, refreshExpiresAt } from '../utils/token.js';
import User from './User.js';

export type Permission = 'logged' | 'self' | 'admin';

const users = () => db.orm.public.User;
const DUMMY_HASH = await hash(generateRandomToken());

class Auth {
  static generateAccessToken(userId: string, sessionVersion: number) {
    const payload: AccessTokenPayload = { sub: userId, sv: sessionVersion };

    return jwt.sign(payload, env.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: env.accessTokenTtl,
    });
  }

  static verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });

      return accessTokenPayloadSchema.parse(payload);
    } catch {
      throw new Unauthorized('Invalid or expired access token');
    }
  }

  static async login(username: string, password: string) {
    const user = await users().first({ username });

    const passwordMatches = await compareHash(password, user?.password || DUMMY_HASH);

    if (!user || !passwordMatches) throw new Unauthorized('Username or password is invalid');

    const refreshToken = generateRandomToken();

    const updated = await users()
      .where({ id: user.id, sessionVersion: user.sessionVersion })
      .update({
        refreshTokenHash: hashToken(refreshToken),
        refreshTokenExpires: refreshExpiresAt(),
      });

    if (!updated) throw new Unauthorized('Session changed, please log in again');

    return {
      user: await User.readById(user.id),
      accessToken: Auth.generateAccessToken(user.id, user.sessionVersion),
      refreshToken,
    };
  }

  static async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new Unauthorized('Missing refresh token');

    const tokenHash = hashToken(refreshToken);
    const user = await users().first({ refreshTokenHash: tokenHash });

    if (!user?.refreshTokenExpires || new Date(user.refreshTokenExpires) <= new Date()) {
      throw new Unauthorized('Invalid or expired refresh token');
    }

    const newRefreshToken = generateRandomToken();
    const updated = await users()
      .where({ id: user.id, refreshTokenHash: tokenHash })
      .update({
        refreshTokenHash: hashToken(newRefreshToken),
        refreshTokenExpires: refreshExpiresAt(),
      });

    if (!updated) throw new Unauthorized('Invalid or expired refresh token');

    return {
      accessToken: Auth.generateAccessToken(user.id, user.sessionVersion),
      refreshToken: newRefreshToken,
    };
  }

  static async logout(userId: string, sessionVersion: number) {
    await users()
      .where({ id: userId })
      .update({
        sessionVersion: sessionVersion + 1,
        refreshTokenHash: null,
        refreshTokenExpires: null,
      });
  }

  static async authenticate(token: string | undefined) {
    if (!token) throw new Unauthorized('Missing access token');

    const { sub, sv } = Auth.verifyAccessToken(token);

    const user = await User.findActiveSession(sub, sv);
    if (!user) throw new Unauthorized('Session is no longer valid');

    return { user, sessionVersion: sv };
  }

  static async checkPermission(user: AuthUser, permission: Permission, id?: string) {
    switch (permission) {
      case 'logged':
        return true;
      case 'self':
        return id === user.id;
      case 'admin':
        return user.admin;
    }
  }
}

export default Auth;
