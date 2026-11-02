import type { NextFunction, Request, Response } from 'express';
import { InvalidRequest } from '../errors/index.js';
import Service from '../services/User.js';
import isUUID from '../utils/isUUID.js';

class User {
  static async readAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await Service.readAll();

      return res.status(200).json({ success: true, users });
    } catch (err) {
      return next(err);
    }
  }

  static async readById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'];

      if (!isUUID(id)) {
        throw new InvalidRequest('O id precisa ser um UUID válido');
      }

      const user = await Service.readById(id);

      return res.status(200).json({ success: true, user });
    } catch (err) {
      return next(err);
    }
  }

  static create(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      msg: 'ok',
    });
  }

  static update(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      msg: 'ok',
    });
  }

  static delete(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      msg: 'ok',
    });
  }
}

export default User;
