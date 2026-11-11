import type UserService from '../services/User.js';

export type AuthUser = NonNullable<Awaited<ReturnType<typeof UserService.findActiveSession>>>;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionVersion?: number;
    }
  }
}
