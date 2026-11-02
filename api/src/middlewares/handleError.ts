import type { NextFunction, Request, Response } from 'express';
import Base from '../errors/Base.js';

const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const isAppError = err instanceof Base;

  if (!isAppError) {
    console.error(err);

    return new Base().send(res);
  }

  if (err.status === 500) console.error(err);

  return err.send(res);
};

export default handleError;
