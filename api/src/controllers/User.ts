import type { Request, Response, NextFunction } from 'express';
import Service from '../services/User.js';

class User {
  static async readAll(req: Request, res: Response, next: NextFunction) {
    const users = await Service.readAll();

    return res.status(200).json({
      "success": true,
      users
    })
  }

  static async readById(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params['id']);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        "success": false,
        "msg": "O id precisa ser um número inteiro"
      })
    }

    const user = await Service.readById(id);

    if (!user) {
      return res.status(404).json({
        "success": false,
        "msg": "Usuário não encontrado"
      })
    }

    return res.status(200).json({
      "success": true,
      "data": user
    })
  }

  static create(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
      "success": true,
      "msg": "ok"
    })
  }

  static update(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
      "success": true,
      "msg": "ok"
    })
  }

  static delete(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
      "success": true,
      "msg": "ok"
    })
  }
}

export default User;