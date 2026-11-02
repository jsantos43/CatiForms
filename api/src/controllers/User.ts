import type { NextFunction, Request, Response } from 'express';
import type { CreateUserData, UserIdParams } from '../schemas/User.js';
import Service from '../services/User.js';

class User {
  static async readAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await Service.readAll();

      return res.status(200).json({ success: true, users });
    } catch (err) {
      return next(err);
    }
  }

  static async readById(req: Request<UserIdParams>, res: Response, next: NextFunction) {
    try {
      const user = await Service.readById(req.params.id);

      return res.status(200).json({ success: true, user });
    } catch (err) {
      return next(err);
    }
  }

  static async create(
    req: Request<Record<string, string>, unknown, CreateUserData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await Service.create(req.body);

      return res.status(201).json({ success: true, user });
    } catch (err) {
      return next(err);
    }
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
