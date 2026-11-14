import type { NextFunction, Request, Response } from 'express';
import Service from '../services/Auth.js';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, sessionVersion } = await Service.authenticate(req.cookies?.['accessToken']);

    req.user = user;
    req.sessionVersion = sessionVersion;

    return next();
  } catch (err) {
    return next(err);
  }
};

export default auth;
