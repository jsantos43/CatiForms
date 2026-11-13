import type { NextFunction, Request, Response } from 'express';
import { Conflict } from '../errors/index.js';
import type { FormIdParams } from '../schemas/Form.js';
import Service from '../services/Form.js';

const verifyPublished = async (req: Request<FormIdParams>, res: Response, next: NextFunction) => {
  try {
    if (await Service.isPublished(req.params.id)) {
      throw new Conflict('This form is published and can no longer be changed');
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

export default verifyPublished;
